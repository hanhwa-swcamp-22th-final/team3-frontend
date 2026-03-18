<script setup>
import {
  TOP_CONTRIBUTORS,
  MENTORING_ACTIVE,
  MENTORING_REQUEST,
  AI_RECOMMENDATIONS,
  TIER_BADGE,
} from '@/mocks/admin/kms/kmsData.js'
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
        <button class="btn-match">매칭</button>
      </div>
    </div>

    <!-- AI 추천 학습 -->
    <div class="panel-section">
      <span class="section-title">🤖 AI 추천 학습</span>
      <div class="ai-list">
        <div v-for="(item, i) in AI_RECOMMENDATIONS" :key="i" class="ai-item">
          <span class="ai-num">{{ i + 1 }}</span>
          <span class="ai-text">{{ item }}</span>
          <span class="ai-arrow">›</span>
        </div>
      </div>
    </div>

  </div>
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

/* AI 추천 */
.ai-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ai-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  border-bottom: 1px solid var(--color-border-soft, #f1eeff);
  cursor: pointer;
}

.ai-item:last-child {
  border-bottom: none;
}

.ai-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-primary-800, #2d1f6e);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary-800, #2d1f6e);
  flex: 1;
}

.ai-arrow {
  font-size: 16px;
  color: var(--color-text-muted, #a89ed8);
}
</style>
