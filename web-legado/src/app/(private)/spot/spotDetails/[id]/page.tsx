import { SpotDetailsTemplate } from '@/templates/App/Spot/SpotDetails';

export default async function SpotPage(props) {
  const params = await props.params;
  return <SpotDetailsTemplate id={params.id} />;
}
