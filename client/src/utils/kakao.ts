/**
 * 카카오 SDK 초기화 함수
 * - 이미 초기화되었으면 건너뜁니다.
 */
export const initKakao = () => {
    if (typeof window !== 'undefined' && window.Kakao) {
        if (!window.Kakao.isInitialized()) {
            const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
            if (!key) {
                console.error('Kakao JavaScript Key is missing in environment variables.');
                return;
            }
            window.Kakao.init(key);
        }
    }
};

/**
 * 카카오톡 초대장 공유 함수
 * @param senderName 보내는 사람 이름 (예: 김조이)
 * @param partyTitle 파티 제목 (예: 한강 치맥 파티)
 * @param partyId 파티 ID (초대 링크 생성용)
 * @param imageUrl (선택) 파티 이미지 URL. 기본값 설정됨.
 */
export const shareInvitation = (
    senderName: string,
    partyTitle: string,
    partyId: string,
    imageUrl: string = 'https://i.ibb.co/3pL6Q05/ticket.png' // 임시 기본 이미지 (필요시 교체)
) => {
    // 사용 전 초기화 재확인
    initKakao();

    if (!window.Kakao || !window.Kakao.isInitialized()) {
        console.error('Kakao SDK not loaded or not initialized');
        alert('카카오톡 연결 중입니다. 잠시 후 다시 시도해주세요.');
        return;
    }

    const shareUrl = `https://jasmin-unsanctioned-noneducationally.ngrok-free.dev/invite/${partyId}?user=1`;

    window.Kakao.Share.sendDefault({
        objectType: 'feed', // 피드 타입 (이미지 + 텍스트 + 버튼)
        content: {
            title: `✉️ [${senderName}]님이 초대장을 보냈어요!`,
            description: `"${partyTitle}" 파티에 당신을 초대합니다. 지금 바로 확인해보세요!`,
            imageUrl: imageUrl,
            link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
            },
        },
        buttons: [
            {
                title: '초대장 확인하기',
                link: {
                    mobileWebUrl: shareUrl,
                    webUrl: shareUrl,
                },
            },
        ],
    });
};
