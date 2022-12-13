import { NextPage } from "next";
import Link from "next/link";
import { FooterComponent, HeadLayoutComponent, NavbarComponent, ProductBoxComponent } from "../../components";
import productCategories from "../../utils/comercial/productCategories";

const CategoriesMenu: NextPage = () => {
  return (
    <div>
      <HeadLayoutComponent
        section={"Catálogo"}
        description={"Catálogo de ropa de Glorious"}
      />
      <NavbarComponent darkNavbar={true}/>
      {/* section */}
      <div className="w-full h-auto py-32 pl-40 pr-10 bg-ivory">
        <h1 className="text-6xl font-Pacifico text-charleston">Catálogo</h1>
        <div className="grid grid-flow-row grid-cols-3 mt-20 gap-y-20 gap-x-28">
          {
            productCategories.map(({key, ...product}) => (
              <ProductBoxComponent key={key} {...product} />
            ))
          }
        </div>
      </div>
      <FooterComponent />
    </div>
  )
}

export default CategoriesMenu;