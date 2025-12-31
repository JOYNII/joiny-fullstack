# core/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event, Participant, Todo, Theme

from .serializers import EventSerializer, ParticipantSerializer, TodoSerializer, ThemeSerializer, RegisterSerializer, UserSerializer
from rest_framework import generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken

from django.db.models import Prefetch

class EventViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny] # 누구나 파티 목록 조회 가능

    # 최신 이벤트 순으로 정렬하고, Nested Serializer를 위해 모든 관련 데이터(참가자, 할일 등)를 미리 가져옵니다.
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        # 파티 목록을 최신순으로 정렬하여 반환합니다.
        # 인증 기능 추가 후에는 request.user를 사용해 필터링해야 합니다.
        return Event.objects.all().order_by('-date')

    # 초대 코드를 통해 이벤트를 조회하는 커스텀 액션
    @action(detail=False, methods=['get'], url_path='by_invite_code/(?P<invite_code>[^/.]+)')
    def retrieve_by_invite_code(self, request, invite_code=None):
        try:
            # UUID 형식으로 검색
            event = self.queryset.get(invite_code=invite_code)
        except Event.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # 상세 Serializer 사용
        serializer = self.get_serializer(event)
        return Response(serializer.data)


# POST 요청을 오버라이드하여 초대 코드를 통한 참가자 등록 로직 구현
class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

    def create(self, request, *args, **kwargs):
        # 요청 데이터에서 이벤트 ID(초대 코드)를 가져옵니다.
        # 기존: invite_code = request.data.get('event') -> 'invite_code' 대신 'event' 필드로 받음
        # 클라이언트에서 'event' 필드에 invite_code를 보낼 수도 있고, event.id를 보낼 수도 있습니다.
        # 현재 api.ts는 joinParty에서 event_id를 보낼 것입니다.
        # 하지만 기존 로직은 invite_code 매칭 방식.
        # api.ts를 수정하여 event_id를 보내도록 하고, 여기서도 event_id로 찾도록 변경하거나
        # 기존대로 invite_code를 유지할지 결정해야 함.
        # 일반적인 joinParty는 id로 하는게 맞음. 초대 코드는 별도.
        
        event_id = request.data.get('event')
        
        # 1. 로그인 여부 확인
        user = request.user
        if not user.is_authenticated:
             return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        if not event_id:
            return Response({'error': 'Event ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # 2. 이벤트 찾기 (ID로 검색 시도, 실패시 invite_code로 시도 - 호환성)
            # api.ts에서 id를 보낸다면 id로 검색이 맞음.
            if str(event_id).isdigit():
                event = Event.objects.get(id=event_id)
            else:
                 event = Event.objects.get(invite_code=event_id)
        except Event.DoesNotExist:
            return Response({'error': 'Event not found.'}, status=status.HTTP_404_NOT_FOUND)

        # 3. 중복 참여 확인
        if Participant.objects.filter(event=event, user=user).exists():
             return Response({'message': 'Already joined.'}, status=status.HTTP_200_OK)

        # 4. 참가자 생성 (User와 연결)
        # 이름은 유저 이름 사용 (또는 별명 입력 받을 수도 있음)
        participant_name = user.username 
        # 만약 클라이언트가 이름을 별도로 보내면 그것을 사용할 수도 있음
        if request.data.get('name'):
            participant_name = request.data.get('name')

        participant = Participant.objects.create(event=event, user=user, name=participant_name)
        serializer = self.get_serializer(participant)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class TodoViewSet(viewsets.ModelViewSet):
    # TodoViewSet 로직 (Todo 항목 관리)
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

# ----------------------------------------------------
# Theme ViewSet (테마 목록 조회) 추가
# ----------------------------------------------------
class ThemeViewSet(viewsets.ReadOnlyModelViewSet):
    """테마 목록을 조회하는 ViewSet (GET /api/themes/)"""
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer

# ----------------------------------------------------
# Auth Views (회원가입, 유저 정보)
# ----------------------------------------------------
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # 회원가입 후 바로 토큰 발급 (선택사항, UX 향상)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            "user": UserSerializer(user).data,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserDetailView(generics.RetrieveAPIView):
    """현재 로그인한 유저 정보 반환"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user