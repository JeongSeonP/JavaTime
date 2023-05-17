import { DocumentData } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
declare global {
  interface Window {
    kakao: any;
  }
}

const KakaoMap = ({ info }: DocumentData) => {
  const container = useRef(null);
  const overlayContainer = useRef(null);
  const [storeMap, setStoreMap] = useState<any>(null);
  //const [position, setPosition] = useState<any>(null);
  const KAKAO_JAVASCRIPT_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
  const href = `http://place.map.kakao.com/${info.id}`;

  useEffect(() => {
    const script = document.createElement("script");
    script.className = "kakaoScript";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JAVASCRIPT_KEY}&autoload=false`;
    document.head.appendChild(script);
    script.onload = () => {
      window.kakao.maps.load(() => {
        const kakaoMap = window.kakao.maps;
        const position = new kakaoMap.LatLng(Number(info.y), Number(info.x));
        //setPosition(position);
        const options = {
          center: position,
          level: 5,
        };
        const map = new kakaoMap.Map(container.current, options);

        const imageSrc = "/src/assets/javatime.png",
          imageSize = new kakaoMap.Size(20, 20),
          imageOption = { offset: new kakaoMap.Point(10, 10) };

        const markerImage = new kakaoMap.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );
        const marker = new kakaoMap.Marker({
          position: options.center,
          image: markerImage,
        });
        marker.setMap(map);

        new kakaoMap.CustomOverlay({
          position: position,
          map: map,
          content: overlayContainer.current,
          yAnchor: 1.5,
        });
        setStoreMap(map);
        //map.relayout();
      });
    };
    return () => script.remove();
  }, [container, info]);

  useEffect(() => {
    if (storeMap) {
      // storeMap.setCenter(position);
      // storeMap.setLevel(4);
      // storeMap.relayout();
      // storeMap.setLevel(5);
      storeMap.relayout();
      console.log("storeMap", storeMap);
    }
  }, [storeMap, info]);

  // const createMap = () => {
  //   if (container.current === null) return;
  //   const { kakao } = window;
  //   window.kakao.maps.load(() => {
  //     const kakaoMap = window.kakao.maps;
  //     const position = new kakao.maps.LatLng(Number(info.y), Number(info.x));
  //     setPosition(position);
  //     console.log("position", position);
  //     const options = {
  //       center: position,
  //       level: 5,
  //     };
  //     const map = new kakaoMap.Map(container.current, options);
  //     const imageSrc = "/src/assets/javatime.png",
  //       imageSize = new kakaoMap.Size(20, 20),
  //       imageOption = { offset: new kakaoMap.Point(10, 10) };

  //     const markerImage = new kakaoMap.MarkerImage(
  //       imageSrc,
  //       imageSize,
  //       imageOption
  //     );
  //     const marker = new kakaoMap.Marker({
  //       position: options.center,
  //       image: markerImage,
  //     });
  //     marker.setMap(map);

  //     new kakaoMap.CustomOverlay({
  //       position: position,
  //       map: map,
  //       content: overlayContainer.current,
  //       yAnchor: 1.5,
  //     });
  //     setStoreMap(map);
  //     //map.relayout();
  //   });
  // };
  /*
  useEffect(() => {
    const kakaoScript = document.querySelector(".kakaoScript");
    const { kakao } = window;
    if (kakaoScript && kakao) {
      (kakaoScript as HTMLScriptElement).onload = () => {};
      window.kakao.maps.load(() => {
        const kakaoMap = window.kakao.maps;
        const position = new kakaoMap.LatLng(y, x);
        const options = {
          center: position,
          level: 5,
        };
        const map = new kakaoMap.Map(container.current, options);

        const imageSrc = "/src/assets/javatime.png",
          imageSize = new kakaoMap.Size(20, 20),
          imageOption = { offset: new kakaoMap.Point(10, 10) };

        const markerImage = new kakaoMap.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );
        const marker = new kakaoMap.Marker({
          position: options.center,
          image: markerImage,
        });
        marker.setMap(map);

        new kakaoMap.CustomOverlay({
          position: position,
          map: map,
          content: overlayContainer.current,
          yAnchor: 1.5,
        });
        map.relayout();
      });
      
    }
  }, [container, id]);
*/
  return (
    <div className="rounded-xl shadow-md overflow-hidden mb-2">
      <div ref={overlayContainer} className="relative inline-block z-[999]">
        <div className="flex items-center w-fit py-1 px-3 h-5 rounded-md bg-primary-light-color  text-xs  after:content-['']  after:absolute after:left-[50%] after:rotate-45 after:-translate-x-2/4 after:-bottom-1 after:w-2 after:h-2 after:border-b-4 after:border-r-4 after:border-primary-light-color shadow-[1px_2px_2px_0px_#fff] after:shadow-[1px_1px_1px_0px_#fff]">
          <a
            href={href}
            className=" "
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="inline-block w-full text-center font-semibold">
              {info.storeName}
            </span>
          </a>
        </div>
      </div>

      <div
        className="md:w-[150px] md:h-[150px] w-[350px] h-[120px]"
        id="container"
        ref={container}
      />
    </div>
  );
};

export default KakaoMap;
