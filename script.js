// 룰렛 항목 정의
const items = [
    '보리빵',
    '10% 할인',
    '보리강정',
    '음료수 한잔',
    '약과또는 너츠',
    '꽝, 한번더!'
];

// 캔버스와 컨텍스트 설정
const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const resultDiv = document.getElementById('result');

// 룰렛 설정
let currentRotation = 0;
let isSpinning = false;
const spinDuration = 5000; // 5초
const spinRounds = 5; // 5바퀴 회전

// 룰렛 그리기 함수
function drawWheel() {
    // 캔버스 중심 좌표와 반지름 계산
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    // 각 항목의 각도 계산
    const anglePerItem = (2 * Math.PI) / items.length;
    // 각 항목 그리기
    items.forEach((item, index) => {
        const startAngle = index * anglePerItem;
        const endAngle = startAngle + anglePerItem;
        // 섹터 그리기
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        // 섹터 색상 설정 (번갈아가며 다른 색상 사용)
        const sectorColors = ['#FFD700', '#FFDDC1', '#B5EAD7', '#C7CEEA', '#FFDAC1', '#E2F0CB', '#FFB7B2', '#B5EAD7'];
        ctx.fillStyle = sectorColors[index % sectorColors.length];
        ctx.fill();
        // 테두리 그리기
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.stroke();
        // 텍스트 방사형 배치
        ctx.save();
        ctx.translate(centerX, centerY);
        // 각 섹터의 중심선에 맞춰 회전
        ctx.rotate(startAngle + anglePerItem / 2);
        // 텍스트 스타일 설정
        ctx.font = 'bold 22px Noto Sans KR, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#333';
        ctx.shadowColor = 'rgba(255,255,255,0.8)';
        ctx.shadowBlur = 4;
        // 텍스트를 섹터의 바깥쪽에 배치 (중앙에서 78% 지점)
        ctx.save();
        ctx.rotate(Math.PI / 2); // 텍스트가 바깥쪽을 향하도록 90도 회전
        ctx.fillText(item, 0, -radius * 0.78);
        ctx.restore();
        ctx.restore();
    });
    // 가운데 원(허브) 그리기
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
}

// 룰렛 회전 애니메이션
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;
    resultDiv.textContent = '';
    // 랜덤 인덱스 선택
    const randomIndex = Math.floor(Math.random() * items.length);
    // 12시 방향(포인터)에서 해당 항목이 오도록 각도 계산
    const anglePerItem = 360 / items.length;
    // 270도(12시 방향)에서 해당 항목의 중앙이 오도록 보정
    const targetAngle = 270 - (randomIndex * anglePerItem) - anglePerItem / 2;
    // 총 회전 각도(여러 바퀴 + 목표 각도)
    const totalRotation = 360 * spinRounds + targetAngle;
    const startTime = Date.now();
    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        if (elapsed < spinDuration) {
            // 이징 함수로 감속 효과
            const progress = elapsed / spinDuration;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentRotation = easeOut * totalRotation;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((currentRotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawWheel();
            ctx.restore();
            requestAnimationFrame(animate);
        } else {
            // 회전 종료
            isSpinning = false;
            spinBtn.disabled = false;
            // 결과 표시
            const result = items[randomIndex];
            resultDiv.textContent = `축하합니다! ${result}에 당첨되셨습니다!`;
            // 폭죽 효과
            if (result !== '꽝, 한번더!') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    }
    animate();
}

// 이벤트 리스너 설정
spinBtn.addEventListener('click', spinWheel);

// 초기 룰렛 그리기
drawWheel(); 