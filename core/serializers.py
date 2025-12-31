# core/serializers.py
from rest_framework import serializers
from .models import Event, Participant, Todo, Theme # Theme 모델 import
from django.contrib.auth.models import User


# ----------------------------------------------------
# Theme Serializer 추가
# ----------------------------------------------------
class ThemeSerializer(serializers.ModelSerializer):
    """테마 목록을 위한 Serializer"""
    class Meta:
        model = Theme
        fields = '__all__'


# ----------------------------------------------------
# User Serializer (사용자 정보 조회)
# ----------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


# ----------------------------------------------------
# Register Serializer (회원가입)
# ----------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


# ----------------------------------------------------
# 추가적 Event Serializer 확장 (장소, 테마, 음식 필드 반영)
# ----------------------------------------------------
class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    invite_url = serializers.SerializerMethodField()
    members = ParticipantSerializer(many=True, read_only=True, source='participant_set')

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'date', # description 필드 추가
            'location_name', 'latitude', 'longitude', 'place_id',
            'theme', 'food_description',
            'host_name', 'fee', # host_name, fee 필드 추가
            'invite_code', 'invite_url', 'members', 'max_members'
        ]
        read_only_fields = ['invite_code', 'invite_url']

    def get_invite_url(self, obj):
        request = self.context.get('request')
        if request is None:
            return None
        # 초대 코드를 통해 이벤트 상세 페이지로 연결되는 URL 생성
        # 예시 URL: http://.../api/events/by_invite_code/uuid_code/
        return request.build_absolute_uri(f"/invite/{obj.invite_code}")



class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'
