import { Profile } from '@/components/UserComponents/Profile/Profile';

const Profiles = ({ params }: { params: { user_id: string } }) => {
  return <Profile user_id={params.user_id} />;
};

export default Profiles;
