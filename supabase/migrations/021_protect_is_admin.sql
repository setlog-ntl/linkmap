-- ============================================
-- Migration 021: is_admin 필드 보호
-- 사용자가 자신의 is_admin 필드를 수정하지 못하도록 RLS 정책 강화
-- ============================================

-- Drop the existing permissive update policy on profiles if it allows is_admin changes
-- Then create a restrictive policy that only allows updating safe fields

-- Ensure profiles has RLS enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a trigger to prevent is_admin modification by non-service-role
CREATE OR REPLACE FUNCTION prevent_is_admin_self_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow service_role to do anything
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Prevent users from changing is_admin
  IF OLD.is_admin IS DISTINCT FROM NEW.is_admin THEN
    RAISE EXCEPTION 'is_admin 필드는 직접 수정할 수 없습니다';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS protect_is_admin ON profiles;
CREATE TRIGGER protect_is_admin
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_is_admin_self_update();
