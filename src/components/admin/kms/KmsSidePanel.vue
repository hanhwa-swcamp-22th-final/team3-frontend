<script setup>
import { ref } from 'vue'
import {
  TOP_CONTRIBUTORS,
  MENTORING_ACTIVE,
  MENTORING_REQUEST,
  AI_RECOMMENDATIONS,
  TIER_BADGE,
} from '@/mocks/admin/kms/kmsData.js'

const showAcceptModal = ref(false)
const accepted = ref(false)

const handleAccept = () => {
  accepted.value = true
  showAcceptModal.value = false
}
</script>

<template>
  <div class="side-panel">

    <!-- 기여자 TOP 3 -->
    <div class="panel-section">
      <span class="section-title">🏆 이달의 지식 기여자</span>
      <div class="contributor-list">
        <div v-for="c in TOP_CONTRIBUTORS" :key="c.name" class="contributor-row">
          <span class="contrib-rank">{{ c.rank }}</span>
          <div class="contrib-avatar" :style="{ background: c.color }">{{ c.initial }}</div>
          <span class="contrib-name">{{ c.name }}</span>
          <span
            class="contrib-tier"
            :style="TIER_BADGE[c.tier]
              ? { background: TIER_BADGE[c.tier].bg, color: TIER_BADGE[c.tier].color }
              : {}"
          >{{ c.tier }}</span>
          <span class="contrib-count">{{ c.count }}건</span>
        </div>
      </div>
    </div>

    <!-- 멘토링 매칭 현황 -->
    <div class="panel-section">
      <span class="section-title">🤝 멘토링 매칭 현황</span>

      <!-- 진행중 -->
      <div v-for="m in MENTORING_ACTIVE" :key="m.tag" class="mentoring-row">
        <div class="mentor-pair">
          <div class="pair-avatar" :style="{ background: m.mentor.color }">{{ m.mentor.initial }}</div>
          <span class="pair-arrow">→</span>
          <div class="pair-avatar" :style="{ background: m.mentee.color }">{{ m.mentee.initial }}</div>
        </div>
        <span class="mentoring-tag" :style="{ background: m.tagBg, color: m.tagColor }">{{ m.tag }}</span>
        <span class="mentoring-status">{{ m.status }}</span>
      </div>

      <!-- 신청 대기 -->
      <div class="mentoring-request">
        <div class="request-avatar" :style="{ background: MENTORING_REQUEST.applicant.color }">
          {{ MENTORING_REQUEST.applicant.initial }}
        </div>
        <span class="request-text">{{ MENTORING_REQUEST.text }}</span>
        <button v-if="!accepted" class="btn-match" @click="showAcceptModal = true">수락</button>
        <span v-else class="request-accepted">✓ 수락됨</span>
      </div>
    </div>

    <!-- AI 추천 학습 -->
    <div class="panel-section panel-section--ai">
      <span class="section-title">🤖 AI 추천 학습</span>
      <div class="ai-list">
        <div v-for="(item, i) in AI_RECOMMENDATIONS" :key="i" class="ai-item">
          <span class="ai-text">{{ item }}</span>
          <span class="ai-arrow">→</span>
        </div>
      </div>
    </div>

  </div>

  <!-- 수락 확인 모달 -->
  <Teleport to="body">
    <div v-if="showAcceptModal" class="accept-overlay" @click.self="showAcceptModal = false">
      <div class="accept-modal">

        <!-- 헤더 -->
        <div class="am-header">
          <p class="am-title">매칭 신청 수락</p>
          <p class="am-desc">아래 멘토링 신청 내용을 확인하고 수락 여부를 결정해주세요.</p>
        </div>

        <!-- 신청자 카드 -->
        <div class="am-applicant">
          <div class="am-avatar" :style="{ background: MENTORING_REQUEST.applicant.color }">
            {{ MENTORING_REQUEST.applicant.initial }}
          </div>
          <div class="am-applicant-info">
            <span class="am-applicant-name">{{ MENTORING_REQUEST.applicant.name }}</span>
            <span class="am-applicant-sub">{{ MENTORING_REQUEST.subText }}</span>
          </div>
          <span class="am-badge">매칭 신청</span>
        </div>

        <!-- 3개 정보 카드 -->
        <div class="am-info-row">
          <div class="am-info-card">
            <span class="am-info-label">요청 분야</span>
            <span class="am-info-value">{{ MENTORING_REQUEST.field }}</span>
          </div>
          <div class="am-info-card">
            <span class="am-info-label">희망 기간</span>
            <span class="am-info-value">{{ MENTORING_REQUEST.duration }}</span>
          </div>
          <div class="am-info-card">
            <span class="am-info-label">우선도</span>
            <span class="am-info-value am-info-value--high">{{ MENTORING_REQUEST.priority }}</span>
          </div>
        </div>

        <!-- 신청 사유 -->
        <div class="am-box">
          <span class="am-box-label">신청 사유</span>
          <p class="am-box-text">{{ MENTORING_REQUEST.reason }}</p>
        </div>

        <!-- 관리 메모 -->
        <div class="am-box">
          <span class="am-box-label">관리 메모</span>
          <textarea class="am-box-textarea" placeholder="메모를 입력하세요..." rows="3"></textarea>
        </div>

        <!-- 버튼 -->
        <div class="am-actions">
          <button class="am-btn am-btn--cancel" @click="showAcceptModal = false">취소</button>
          <button class="am-btn am-btn--confirm" @click="handleAccept">수락</button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: var(--font-family-base);
}

/* 공통 섹션 */
.panel-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--color-bg-surface, #ffffff);
  border: 1.5px solid var(--color-border-default, #e0dcff);
  border-radius: 12px;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-sub, #7a6fa8);
}

/* 기여자 */
.contributor-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contributor-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  border-bottom: 1px solid var(--color-border-soft, #f1eeff);
}

.contributor-row:last-child {
  border-bottom: none;
}

.contrib-rank {
  font-size: 14px;
  width: 22px;
  flex-shrink: 0;
}

.contrib-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.contrib-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-800, #2d1f6e);
  flex: 1;
}

.contrib-tier {
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
}

.contrib-count {
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary-600, #5b4fcf);
  flex-shrink: 0;
}

/* 멘토링 */
.mentoring-row {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  border-bottom: 1px solid var(--color-border-soft, #f1eeff);
}

.mentor-pair {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pair-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.pair-arrow {
  font-size: 11px;
  color: var(--color-text-muted, #a89ed8);
}

.mentoring-tag {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  flex: 1;
}

.mentoring-status {
  font-size: 10px;
  font-weight: 700;
  color: #00bf95;
  flex-shrink: 0;
}

/* 신청 대기 */
.mentoring-request {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--color-bg-app, #fafbff);
  border-radius: 8px;
}

.request-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #ffffff;
  background: #7a6fa8;
  flex-shrink: 0;
}

.request-text {
  font-size: 10px;
  color: var(--color-text-sub, #7a6fa8);
  flex: 1;
}

.btn-match {
  height: 24px;
  padding: 0 10px;
  background: var(--color-primary-800, #2d1f6e);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-family-base);
  flex-shrink: 0;
}

/* 수락됨 텍스트 */
.request-accepted {
  font-size: 10px;
  font-weight: 700;
  color: #007A60;
  flex-shrink: 0;
}

/* AI 추천 섹션 배경 */
.panel-section--ai {
  background: var(--color-primary-800, #2d1f6e);
  border-color: var(--color-primary-800, #2d1f6e);
  padding: 18px 18px 0;
}

.panel-section--ai .section-title {
  color: rgba(255, 255, 255, 0.9);
}

/* 수락 모달 오버레이 */
.accept-overlay {
  position: fixed;
  inset: 0;
  background: rgba(40, 27, 83, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.accept-modal {
  background: #ffffff;
  border: 3px solid rgba(93, 80, 215, 0.12);
  border-radius: 28px;
  padding: 32px 32px 28px;
  width: 720px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0px 34px 80px rgba(40, 27, 83, 0.26);
}

/* 헤더 */
.am-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 20px;
  border-bottom: 3px solid #ECE8F6;
}

.am-title {
  font-size: 30px;
  font-weight: 900;
  color: #32265F;
  margin: 0;
}

.am-desc {
  font-size: 15px;
  color: #938ABF;
  margin: 0;
}

/* 신청자 카드 */
.am-applicant {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  background: #FBFAFF;
  border: 3px solid #E6E1F4;
  border-radius: 18px;
}

.am-avatar {
  width: 54px;
  height: 54px;
  border-radius: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
}

.am-applicant-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.am-applicant-name {
  font-size: 22px;
  font-weight: 800;
  color: #32265F;
}

.am-applicant-sub {
  font-size: 14px;
  color: #938ABF;
}

.am-badge {
  padding: 5px 14px;
  background: #F8EFD8;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #B8841D;
  flex-shrink: 0;
}

/* 3개 정보 카드 */
.am-info-row {
  display: flex;
  gap: 12px;
}

.am-info-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 18px;
  background: #FFFFFF;
  border: 3px solid #E6E1F4;
  border-radius: 16px;
}

.am-info-label {
  font-size: 12px;
  font-weight: 600;
  color: #938ABF;
}

.am-info-value {
  font-size: 18px;
  font-weight: 800;
  color: #32265F;
}

.am-info-value--high {
  color: #C0103E;
}

/* 신청 사유 / 관리 메모 박스 */
.am-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 18px;
  background: #FBFAFF;
  border: 3px solid #E6E1F4;
  border-radius: 18px;
}

.am-box-label {
  font-size: 12px;
  font-weight: 700;
  color: #938ABF;
}

.am-box-text {
  font-size: 13px;
  color: #32265F;
  line-height: 1.6;
  margin: 0;
}

.am-box-textarea {
  width: 100%;
  resize: none;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #32265F;
  font-family: var(--font-family-base);
  outline: none;
  box-sizing: border-box;
}

.am-box-textarea::placeholder {
  color: #C4BADF;
}

/* 버튼 */
.am-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.am-btn {
  height: 48px;
  padding: 0 28px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  font-family: var(--font-family-base);
}

.am-btn--cancel {
  background: #FFFFFF;
  border: 3px solid #DDD8F2;
  color: #938ABF;
}

.am-btn--cancel:hover { background: #F5F3FF; }

.am-btn--confirm {
  background: #5D50D7;
  border: none;
  color: #ffffff;
}

.am-btn--confirm:hover { background: #4a3fb0; }

/* AI 추천 */
.ai-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 18px;
}

.ai-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  height: 34px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  box-sizing: border-box;
}

.ai-text {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
}

.ai-arrow {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
}
</style>
