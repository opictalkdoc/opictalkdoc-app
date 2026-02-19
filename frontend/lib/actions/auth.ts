"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";

// 공통 응답 타입
type AuthResult = {
  error?: string;
};

export async function login(formData: FormData): Promise<AuthResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다" };
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData): Promise<AuthResult> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "이미 가입된 이메일입니다" };
    }
    return { error: "회원가입에 실패했습니다. 다시 시도해주세요" };
  }

  redirect("/auth-success?type=signup");
}

export async function forgotPassword(formData: FormData): Promise<AuthResult> {
  const raw = {
    email: formData.get("email") as string,
  };

  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
    }
  );

  if (error) {
    return { error: "비밀번호 재설정 메일 발송에 실패했습니다" };
  }

  redirect("/auth-success?type=forgot-password");
}

export async function resetPassword(formData: FormData): Promise<AuthResult> {
  const raw = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = resetPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: "비밀번호 변경에 실패했습니다. 다시 시도해주세요" };
  }

  redirect("/auth-success?type=reset-password");
}

export async function loginWithOAuth(provider: "google" | "kakao") {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error || !data.url) {
    return { error: "소셜 로그인에 실패했습니다" };
  }

  redirect(data.url);
}

export async function updateProfile(formData: FormData): Promise<AuthResult> {
  const name = formData.get("name") as string;
  if (!name?.trim()) {
    return { error: "이름을 입력해주세요" };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    data: { display_name: name.trim() },
  });

  if (error) {
    return { error: "프로필 업데이트에 실패했습니다" };
  }

  revalidatePath("/mypage");
  revalidatePath("/dashboard");
  return {};
}

export async function updateGoals(formData: FormData): Promise<AuthResult> {
  const targetGrade = formData.get("targetGrade") as string;
  const examDate = formData.get("examDate") as string;
  const weeklyGoal = formData.get("weeklyGoal") as string;

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    data: {
      target_grade: targetGrade || null,
      exam_date: examDate || null,
      weekly_goal: weeklyGoal || null,
    },
  });

  if (error) {
    return { error: "목표 설정 저장에 실패했습니다" };
  }

  revalidatePath("/mypage");
  revalidatePath("/dashboard");
  return {};
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
