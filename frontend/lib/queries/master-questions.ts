"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";

// 카테고리별 주제 목록 (Step 2 TopicPagination용)
export async function getTopicsByCategory(category: "일반" | "롤플레이" | "어드밴스") {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("master_questions")
    .select("topic")
    .eq("topic_category", category)
    .neq("topic", "자기소개");

  if (error) return [];

  // 유니크 주제 + 각 주제별 질문 수
  const topicCounts = new Map<string, number>();
  for (const row of data) {
    topicCounts.set(row.topic, (topicCounts.get(row.topic) || 0) + 1);
  }

  return Array.from(topicCounts.entries())
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => a.topic.localeCompare(b.topic, "ko"));
}

// 주제별 질문 목록 (Step 2 QuestionSelector용)
export async function getQuestionsByTopic(
  topic: string,
  category: "일반" | "롤플레이" | "어드밴스"
) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("master_questions")
    .select("question_id, question_english, question_korean, answer_type, topic")
    .eq("topic_category", category)
    .eq("topic", topic)
    .order("question_id");

  if (error) return [];
  return data;
}
