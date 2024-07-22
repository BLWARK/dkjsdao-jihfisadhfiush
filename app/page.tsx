import Image from "next/image";
import Link from 'next/link';
import { FaTelegramPlane } from "react-icons/fa";




export default function Home() {

  // useEffect(() => {
  //   window.TelegramLoginWidget = {
  //     dataOnauth: user => {
  //       // Handle authentication here
  //       console.log(user);
  //       fetch('/api/auth/telegram', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(user)
  //       })
  //       .then(res => res.json())
  //       .then(data => {
  //         // Handle successful authentication
  //         console.log(data);
  //       })
  //       .catch(err => {
  //         // Handle error
  //         console.error(err);
  //       });
  //     }
  //   };
  // }, []);
  return (
    <div className="w-full flex min-h-screen flex-col items-center justify-start bgs">
      <div className="wrapper mt-14 flex justify-center items-center flex-col">
      <div className="neons font-bold text-4xl flex justify-center items-center mt-6">
      <div>WELCOME TO</div>
	    <div>WELCOME TO</div>
	    <div>WELCOME TO</div>
      </div>
      
      <div className="neons font-bold text-4xl flex justify-center items-center mt-10">
      <div>AIRDROP XYZMER</div>
	    <div>AIRDROP XYZMER</div>
	    <div>AIRDROP XYZMER</div>
      </div>
      
      <div className="wrap-logo coin  flex justify-center items-center mt-20 ">
      <Image src="/XYZMER COIN.png" alt="Logo" width={250} height={250}  />
      </div>
      
      <Link href="/main/earn">
      <div className="connect-wallet mt-20 flex justify-center items-center">
      
        <p className="w-[300px] h-[65px] font-bold but rounded-full flex justify-center items-center gap-3"><FaTelegramPlane  className="text-[22px]"/> Login With Telegram</p>
      </div>
      </Link>
      
      </div>
    </div>
  );
}
