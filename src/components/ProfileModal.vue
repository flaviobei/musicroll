<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { supabase } from "../lib/supabase";
import { useDemo } from "../composables/useDemo";
import {
  X,
  User,
  Lock,
  Mail,
  Check,
  ChevronDown,
  ChevronUp,
} from "@lucide/vue";

const props = defineProps({
  user: Object,
});

const emit = defineEmits(["close", "show-notification"]);
const { t } = useI18n();
const { isDemo } = useDemo();

const isSubmitting = ref(false);
const isPasswordExpanded = ref(false);

// Form Reactive State
const email = computed(() => props.user?.email || "musico@musicroll.com");
const displayName = ref(props.user?.user_metadata?.display_name || "");
const musicalRole = ref(props.user?.user_metadata?.musical_role || "other");
const avatarUrl = ref(props.user?.user_metadata?.avatar_url || "");
const acceptEmails = ref(props.user?.user_metadata?.accept_emails || false);

// Password settings state
const newPassword = ref("");
const confirmPassword = ref("");

// Curated list of premium avatars (colored dynamic gradients + instruments emojis)
const PRESET_AVATARS = [
  {
    id: "preset:vocalist",
    emoji: "🎤",
    gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
  },
  {
    id: "preset:guitarist",
    emoji: "🎸",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
  },
  {
    id: "preset:bassist",
    emoji: "🎸",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  },
  {
    id: "preset:drummer",
    emoji: "🥁",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  },
  {
    id: "preset:keyboardist",
    emoji: "🎹",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  },
  {
    id: "preset:producer",
    emoji: "🎧",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
  },
  {
    id: "preset:notegirl",
    emoji: "🎵",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
  },
  {
    id: "preset:cool",
    emoji: "🕶️",
    gradient: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  },
];

const selectPresetAvatar = (presetId) => {
  avatarUrl.value = presetId;
};

const saveProfile = async () => {
  isSubmitting.value = true;

  if (isPasswordExpanded.value && newPassword.value) {
    if (newPassword.value !== confirmPassword.value) {
      emit("show-notification", {
        type: "error",
        message: t("profile.passwordMismatch"),
      });
      isSubmitting.value = false;
      return;
    }
    if (newPassword.value.length < 6) {
      emit("show-notification", {
        type: "error",
        message: t("profile.passwordShort"),
      });
      isSubmitting.value = false;
      return;
    }
  }

  try {
    const updatedMetadata = {
      display_name: displayName.value.trim(),
      musical_role: musicalRole.value,
      avatar_url: avatarUrl.value,
      accept_emails: acceptEmails.value,
    };

    if (isDemo) {
      // Demo fallback: persist to local storage and direct state updates
      if (props.user) {
        if (!props.user.user_metadata) props.user.user_metadata = {};
        Object.assign(props.user.user_metadata, updatedMetadata);
        localStorage.setItem("musicroll_demo_user", JSON.stringify(props.user));
      }

      const successMsg =
        isPasswordExpanded.value && newPassword.value
          ? t("profile.successUpdate") + " (Senha simulada no modo demo)"
          : t("profile.successUpdate");

      emit("show-notification", { type: "success", message: successMsg });
      emit("close");
      return;
    }

    // Real Supabase Save: User Metadata
    const { error: metaError } = await supabase.auth.updateUser({
      data: updatedMetadata,
    });

    if (metaError) throw metaError;

    // Real Supabase Save: Password
    if (isPasswordExpanded.value && newPassword.value) {
      const { error: passError } = await supabase.auth.updateUser({
        password: newPassword.value,
      });
      if (passError) throw passError;
    }

    emit("show-notification", {
      type: "success",
      message: t("profile.successUpdate"),
    });
    emit("close");
  } catch (err) {
    console.error("Error saving profile settings:", err);
    emit("show-notification", {
      type: "error",
      message: t("profile.errorUpdate") + ": " + (err.message || err),
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content glass-panel" @click.stop>
      <div class="modal-header">
        <h3 class="gradient-text-primary">{{ $t("profile.title") }}</h3>
        <button
          @click="$emit('close')"
          class="btn-icon"
          :title="$t('app.close')"
        >
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="saveProfile" class="profile-form">
          <!-- Email (Read-Only) -->
          <div class="form-group mb-4">
            <label class="form-label">{{ $t("profile.email") }}</label>
            <div class="input-with-icon disabled">
              <Mail class="input-icon" :size="18" />
              <input
                type="email"
                :value="email"
                disabled
                class="form-input read-only"
              />
            </div>
          </div>

          <!-- Display Name -->
          <div class="form-group mb-4">
            <label class="form-label" for="profileDisplayName">{{
              $t("profile.displayName")
            }}</label>
            <div class="input-with-icon">
              <User class="input-icon" :size="18" />
              <input
                id="profileDisplayName"
                type="text"
                v-model="displayName"
                :placeholder="$t('profile.displayNamePlaceholder')"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Musical Role -->
          <div class="form-group mb-4">
            <label class="form-label" for="profileMusicalRole">{{
              $t("profile.musicalRole")
            }}</label>
            <select
              id="profileMusicalRole"
              v-model="musicalRole"
              class="form-input select-input"
            >
              <option value="vocalist">
                {{ $t("profile.roles.vocalist") }}
              </option>
              <option value="guitarist">
                {{ $t("profile.roles.guitarist") }}
              </option>
              <option value="bassist">{{ $t("profile.roles.bassist") }}</option>
              <option value="drummer">{{ $t("profile.roles.drummer") }}</option>
              <option value="keyboardist">
                {{ $t("profile.roles.keyboardist") }}
              </option>
              <option value="producer">
                {{ $t("profile.roles.producer") }}
              </option>
              <option value="other">{{ $t("profile.roles.other") }}</option>
            </select>
          </div>

          <!-- Avatars Gallery Selection -->
          <div class="form-group mb-4">
            <label class="form-label">{{ $t("profile.selectAvatar") }}</label>
            <div class="avatar-presets-grid">
              <button
                v-for="preset in PRESET_AVATARS"
                :key="preset.id"
                type="button"
                class="avatar-preset-btn"
                :style="{ background: preset.gradient }"
                :class="{ active: avatarUrl === preset.id }"
                @click="selectPresetAvatar(preset.id)"
                :title="preset.id.replace('preset:', '')"
              >
                <span class="avatar-preset-emoji">{{ preset.emoji }}</span>
                <span
                  v-if="avatarUrl === preset.id"
                  class="avatar-active-badge"
                >
                  <Check :size="10" />
                </span>
              </button>
            </div>
          </div>

          <!-- Newsletter Preferences Toggle -->
          <div class="form-group-checkbox mb-6">
            <label class="checkbox-container">
              <input type="checkbox" v-model="acceptEmails" />
              <span class="checkmark"></span>
              <span class="checkbox-label text-sm opacity-90">
                {{ $t("profile.emailSubscription") }}
              </span>
            </label>
          </div>

          <!-- Password Collapsible Section -->
          <div class="password-collapsible mb-6">
            <button
              type="button"
              class="collapsible-header"
              @click="isPasswordExpanded = !isPasswordExpanded"
            >
              <span>{{ $t("profile.changePassword") }}</span>
              <component
                :is="isPasswordExpanded ? ChevronUp : ChevronDown"
                :size="16"
              />
            </button>

            <div
              v-if="isPasswordExpanded"
              class="collapsible-content mt-4 bounce-in"
            >
              <div class="form-group mb-4">
                <label class="form-label" for="profileNewPassword">{{
                  $t("profile.newPassword")
                }}</label>
                <div class="input-with-icon">
                  <Lock class="input-icon" :size="18" />
                  <input
                    id="profileNewPassword"
                    type="password"
                    v-model="newPassword"
                    :placeholder="$t('profile.newPasswordPlaceholder')"
                    class="form-input"
                    :required="isPasswordExpanded"
                  />
                </div>
              </div>

              <div class="form-group mb-4">
                <label class="form-label" for="profileConfirmPassword">{{
                  $t("profile.confirmPassword")
                }}</label>
                <div class="input-with-icon">
                  <Lock class="input-icon" :size="18" />
                  <input
                    id="profileConfirmPassword"
                    type="password"
                    v-model="confirmPassword"
                    :placeholder="$t('profile.confirmPasswordPlaceholder')"
                    class="form-input"
                    :required="isPasswordExpanded"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-secondary"
            >
              {{ $t("app.cancel") }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              <span
                v-if="isSubmitting"
                class="loading-spinner small mr-2"
              ></span>
              {{ $t("profile.saveBtn") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
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
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: #0f172a;
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 500px;
  max-height: min(85vh, 600px);
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 1rem;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.modal-body {
  overflow-y: auto;
  padding-right: 0.5rem;
  flex-grow: 1;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon.disabled {
  opacity: 0.6;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  pointer-events: none;
}

.form-input {
  padding-left: 2.75rem;
}

.form-input.read-only {
  background: rgba(255, 255, 255, 0.02);
  cursor: not-allowed;
}

.select-input {
  padding-left: 1rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-main);
  cursor: pointer;
}

.select-input option {
  background: #0f172a;
  color: var(--text-main);
}

/* Preset Avatars Selection */
.avatar-presets-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.avatar-preset-btn {
  border: none;
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  padding: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.avatar-preset-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.avatar-preset-btn.active {
  transform: scale(1.05);
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}

.avatar-preset-emoji {
  font-size: 1.15rem;
}

.avatar-active-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: var(--accent-primary);
  color: white;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #0f172a;
}

/* Custom Checkbox Design */
.form-group-checkbox {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  user-select: none;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-left: 2rem;
  cursor: pointer;
  line-height: 1.4;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 2px;
  left: 0;
  height: 18px;
  width: 18px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: rgba(255, 255, 255, 0.1);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--accent-primary);
  border-color: var(--accent-primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 4px;
  height: 9px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Collapsible Password Box */
.password-collapsible {
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.01);
  border-radius: var(--radius-sm);
  padding: 1rem;
  transition: all 0.2s ease;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.collapsible-header {
  width: 100%;
  background: none;
  border: none;
  color: var(--text-main);
  font-weight: 600;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0;
}

.collapsible-header:hover {
  color: var(--accent-primary-hover);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  align-items: center;
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-content {
    padding: 1.25rem;
    max-height: min(90vh, 600px);
  }

  .modal-header {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
  }

  .avatar-presets-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }
}
</style>
