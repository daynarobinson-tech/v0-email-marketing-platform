insert into public.subscribers (
  email,
  first_name,
  token_balance,
  flow_address,
  is_verified,
  user_id
)
values
  (
    'dayna@talkglobal.net',
    'Dayna',
    275,
    '0xdayna123456789',
    true,
    'aff37b56-cf84-4830-9a77-395b7c443a64'
  ),
  (
    'daynarobinson@talkglobal.net',
    'Dayna',
    420,
    '0xdayna987654321',
    true,
    null
  )
on conflict (email) do update
set
  first_name = excluded.first_name,
  token_balance = excluded.token_balance,
  flow_address = excluded.flow_address,
  is_verified = excluded.is_verified,
  user_id = coalesce(excluded.user_id, public.subscribers.user_id);
