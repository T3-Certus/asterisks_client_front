import Head from "next/head";
import { FunctionComponent } from "react";
import { HeadProps } from "../../utils/interfaces/global";


const HeadComponent: FunctionComponent<HeadProps> = ({ description, section }) => {
  return (<Head>
    <meta name="google-site-verification" content="KJ2ydT0w5ldU_28AlENYqOlPTemIwzp8CMRI4YmsXlM" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Asterisks | {section}</title>
  </Head>
  );
}

export default HeadComponent;