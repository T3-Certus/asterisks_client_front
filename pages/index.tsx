import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from "next";
import { ProductBoxComponent, FooterComponent, NavbarComponent, HeadLayoutComponent } from "../components";
import { productCategories } from "../utils";

interface PageProps{
  resJson: object,
  error: boolean,
  success: boolean
}

const HomePrincipalComponent = ({resJson, error, success}: PageProps) => {

  console.log({resJson, error, success})
  
 
  return (
    <div>
      <HeadLayoutComponent
        section={"Index"}
        description={"Asterisks, tienda virtual"}
      />
      <NavbarComponent />
      {/* header */}
      <div className="relative w-full h-screen bg-no-repeat bg-cover bg-backgroundIndex">
        {/* <Image alt="" layout="fill" style={{zIndex: '-10'}} objectFit="cover" src={"/img/background.jpg"}> 
        
        </Image>   */}
        <div className="z-20 flex flex-col justify-center h-full gap-4 px-10 bg-gradient-to-r from-black/50 text-ivory">
          <p className="font-Pacifico text-7xl">Asterisks</p>
          <p className="text-xl ml-14 font-Comfortaa">by Peruvian designers</p>
        </div>
      </div>
      {/* section */}
      <div className="grid items-center w-full h-screen grid-cols-2 grid-rows-1 gap-20 px-10 bg-green">
        <div className="h-60%">
          <div className="flex flex-col items-center justify-end w-full h-full bg-no-repeat bg-cover shadow-xl rounded-3xl bg-horizontalIndex">
            <div className="flex flex-col items-center justify-center w-full rounded-b-3xl hover:cursor-pointer hover:bg-teal h-14 bg-charleston text-ivory ">
              <span className="text-base font-Comfortaa">Conoce mas</span>
            </div>
          </div>
        </div>
        <article className="flex flex-col gap-6 pl-14">
          <h1 className="text-6xl font-Pacifico ">Nueva Colección</h1>
          <h2 className="text-base font-bold font-Comfortaa">
            Otoño - Invierno
          </h2>
          <p className="">
            Llegó el frío y junto a él la inspiración de nuestros diseñadores.
            Estas nuevas prendas serán tu perfecto complemento en estas
            estaciones.
          </p>
        </article>
      </div>
      {/* store */}
      <div className="w-full h-auto py-32 pl-40 pr-10 bg-ivory">
        <h1 className="text-6xl text-charleston font-Pacifico">Store</h1>
        <div className="grid grid-flow-row grid-cols-3 mt-20 gap-y-20 gap-x-28">
          {productCategories.map(({key, ...product}) => (
            <ProductBoxComponent
              key={key}
              {...product}
            />
          ))}
        </div>
      </div>
      {/* footer */}
      <FooterComponent />
    </div>
  );
};

export default HomePrincipalComponent;

// export const getServerSideProps: GetServerSideProps = async(context) =>{

//   try {
//     const res = await fetch(serviceUrl)
//     const resJson = await res.json()
//     return{
//       props:{
//         resJson,
//         success: true
//       }
//     }
    
//   } catch (error) {
//     return {
//       props:{
//         error: true
//       }
//     }
//   }

// }

// export const getStaticPaths: GetStaticPaths = async() => {
//   return {
//     paths:[],
//     fallback: true
//   }
// }