<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { X, Send, AlertCircle, Lightbulb, MessageSquare } from "@lucide/vue";
import { supabase } from "../lib/supabase";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close"]);
const { t } = useI18n();

const type = ref("idea");
const message = ref("");
const isSubmitting = ref(false);
const showSuccess = ref(false);
const errorMsg = ref("");

const submitFeedback = async () => {
  if (!message.value.trim()) return;
  
  isSubmitting.value = true;
  errorMsg.value = "";
  
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    const { error } = await supabase.from("feedback").insert({
      user_id: userData.user.id,
      type: type.value,
      message: message.value.trim(),
      status: "new"
    });

    if (error) throw error;

    showSuccess.value = true;
    message.value = "";
    
    // Auto close after 3 seconds
    setTimeout(() => {
      closeModal();
    }, 3000);
    
  } catch (error) {
    console.error("Error submitting feedback:", error);
    errorMsg.value = t("feedback.error");
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  showSuccess.value = false;
  message.value = "";
  type.value = "idea";
  errorMsg.value = "";
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content glass-panel bounce-in">
      <div class="modal-header">
        <h3 class="gradient-text-primary">{{ $t("feedback.title") }}</h3>
        <button type="button" @click="closeModal" class="btn-icon">
          <X :size="20" />
        </button>
      </div>
      
      <div class="modal-body">
        <p class="mb-4 text-sm opacity-80">{{ $t("feedback.description") }}</p>
        
        <div v-if="showSuccess" class="success-message glass-panel p-4 text-center mb-4">
          <div class="success-icon mb-2">✨</div>
          <h4>{{ $t("feedback.successTitle") }}</h4>
          <p class="text-sm opacity-80">{{ $t("feedback.successMessage") }}</p>
        </div>
        
        <form v-else @submit.prevent="submitFeedback" class="feedback-form">
          <div class="form-group mb-4">
            <label class="form-label">{{ $t("feedback.typeLabel") }}</label>
            <div class="type-selector">
              <label class="type-option" :class="{ active: type === 'bug' }">
                <input type="radio" v-model="type" value="bug" name="feedbackType" style="display: none;">
                <AlertCircle :size="16" class="mr-2" />
                {{ $t("feedback.typeBug") }}
              </label>
              <label class="type-option" :class="{ active: type === 'idea' }">
                <input type="radio" v-model="type" value="idea" name="feedbackType" style="display: none;">
                <Lightbulb :size="16" class="mr-2" />
                {{ $t("feedback.typeIdea") }}
              </label>
              <label class="type-option" :class="{ active: type === 'other' }">
                <input type="radio" v-model="type" value="other" name="feedbackType" style="display: none;">
                <MessageSquare :size="16" class="mr-2" />
                {{ $t("feedback.typeOther") }}
              </label>
            </div>
          </div>
          
          <div class="form-group mb-4">
            <label for="feedbackMessage" class="form-label">{{ $t("feedback.messageLabel") }}</label>
            <textarea 
              id="feedbackMessage" 
              v-model="message" 
              class="form-input textarea" 
              rows="4" 
              :placeholder="$t('feedback.messagePlaceholder')"
              required
            ></textarea>
          </div>
          
          <p v-if="errorMsg" class="error-msg mb-4">{{ errorMsg }}</p>
          
          <div class="form-actions mt-6">
            <button type="button" @click="closeModal" class="btn btn-secondary">
              {{ $t("app.cancel") }}
            </button>
            <button type="submit" class="btn btn-primary btn-icon-text" :disabled="isSubmitting || !message.trim()">
              <Send :size="16" v-if="!isSubmitting" />
              <span v-if="isSubmitting" class="loading-spinner small mr-2"></span>
              {{ isSubmitting ? $t("app.sending") : $t("feedback.submit") }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #0f172a;
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  align-items: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.type-selector {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.type-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  user-select: none;
}

.type-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.type-option.active {
  background: rgba(var(--primary-color-rgb), 0.2);
  border-color: var(--primary-color);
  color: var(--primary-color);
  box-shadow: 0 0 10px rgba(var(--primary-color-rgb), 0.3);
}

.success-message {
  border: 1px solid rgba(var(--success-color-rgb, 76, 175, 80), 0.3);
  background: rgba(var(--success-color-rgb, 76, 175, 80), 0.1);
  animation: fadeIn 0.3s ease;
}

.success-icon {
  font-size: 2rem;
}

.textarea {
  resize: vertical;
  min-height: 100px;
}

@media (max-width: 480px) {
  .type-selector {
    flex-direction: column;
  }
}
</style>
