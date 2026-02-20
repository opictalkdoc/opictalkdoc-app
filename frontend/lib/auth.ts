import { cache } from "react";
import { createServerSupabaseClient } from "./supabase-server";

// React cache()로 동일 요청 내 getUser()를 1회만 호출 (Navbar + 페이지 공유)
export const getUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
