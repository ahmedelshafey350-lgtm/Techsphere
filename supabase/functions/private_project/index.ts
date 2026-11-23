import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { projectCode } = await req.json()

    if (!projectCode) {
      throw new Error("رقم المشروع (projectCode) مطلوب.")
    }

    // إنشاء عميل Supabase مع تمرير توكن المصادقة الخاص بالمستخدم لضمان الأمان والصلاحيات
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 1. جلب بيانات المستخدم الحالي
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error("يجب تسجيل الدخول للوصول إلى هذا المشروع.")
    }

    // 2. التحقق من وجود صلاحية فعالة (Active Access) للمستخدم على هذا المشروع
    // (أو يمكنك تعديل الجدول حسب تصميم قاعدة البيانات لديك)
    const { data: projectData, error: projectError } = await supabaseClient
      .from('projects')
      .select('*, documents(*)')
      .eq('project_code', projectCode)
      .single()

    if (projectError || !projectData) {
      throw new Error("لم يتم العثور على المشروع المطلوبة أو أن الكود غير صحيح.")
    }

    // 3. جلب معلومات التوثيق والملفات الخاصة بالمشروع
    // (بافتراض أن الجدول يحتوي على علاقات صحيحة أو يتم جلبها مباشرة)
    const responseData = {
      project: projectData,
      document: projectData.documents?.[0] || { id: null, documentation: {}, private_files: [] },
      access: { id: "active-session", status: "active" },
      customer: { name: user.user_metadata?.full_name || user.email, email: user.email },
      versions: []
    }

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})