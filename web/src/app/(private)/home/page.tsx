import { http } from '@/repository/axios/axios';
import HomeTemplate from '@/templates/App/HomeTemplate';

export default async function Home() {
  const query = `
  query getAllSpots { 
	getAllSpots {
		name
		description
		images
		coordinates
		isPaid
		coordinates
		hasCoverage
		alwaysOpen
		modality	
	}
}`;

  let res;

  try {
    res = await http.post('', { query });
  } catch (err) {
    console.log(err);
  }

  console.log('🚀 ~ Home ~ res.data:', res?.data.data.getAllSpots);
  return <HomeTemplate spots={res?.data.data.getAllSpots || []} />;
}
