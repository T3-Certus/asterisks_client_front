import { GetServerSideProps, NextPage } from "next";
import { ErrorComponent, FooterComponent, HeadLayoutComponent, NavbarComponent } from "../../../components";
import { AsterisksServices, PageProps } from "../../../utils";
import Image from "next/image";
import productCategories from "../../../utils/comercial/productCategories";
import SpecificProductBox from "../../../components/products/SpecificProductBoxComponent";

const CategoryProductsMenu: NextPage<PageProps> = ({ success, error, data }) => {
  console.log({ success, error, data })

  if (error) {
    return (
      <ErrorComponent data={data} />
    )
  }

  const { message, categoryName, products } = data
  const category = categoryName.substring(0, 1).toUpperCase() + categoryName.substring(1)

  const internalCategory = productCategories.find((cat) => {
    return cat.href == categoryName
  })


  console.log("Category name => ", categoryName)
  console.log("Products =>", { products })

  return (
    <div>
      <HeadLayoutComponent section={categoryName} description={categoryName} />
      <NavbarComponent />

      <div className="w-full h-auto px-10 py-32 bg-ivory">
        <div className="grid grid-rows-1 grid-cols-11 w-full h-80% items-center ">
          <h1 className="col-start-2 text-6xl text-charleston font-Pacifico">
            {category}
          </h1>
          <div className="relative w-full h-full col-span-5 col-start-6 shadow-xl rounded-3xl" >
            <Image alt="" className="rounded-3xl" layout="fill" objectFit="cover" src={internalCategory!.imgKey} />
          </div >
        </div>

        {
          products.length === 0 ? (
            <div className="flex flex-col items-center mt-20">
              <p className="text-xl">{message}</p>
            </div>
          ) : (

            <div className="grid grid-flow-row grid-cols-4 mt-20 gap-y-20 gap-x-14">
              {
                products.map((product: any) => (
                  <SpecificProductBox key={product.id_global_product} category={product.product_category.name} name={product.product_name} sku={product.product_url_code} individuals={product.individual_products}/>
                ))
              }
            </div>
          )
        }
      </div>
      <FooterComponent />
    </div>
  )
}

export default CategoryProductsMenu

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category } = context.params!
  try {

    // category validation
    const cat = await fetch(AsterisksServices.ms_store_misc + `/products/categories?product_category_name=${category}`)
    const catJson = await cat.json()

    if (catJson.responseBody.length === 0) {
      return {
        props: {
          error: true,
          data: "La categoría que buscas no existe"
        }
      }
    }

    // category products validation
    const categoryId = catJson.responseBody[0].id_product_category
    const products = await fetch(AsterisksServices.ms_products_index + `/products/globals?id_product_category=${categoryId}`)
    const productsJson = await products.json()
    if (productsJson.responseBody.length === 0) {
      return {
        props: {
          success: true,
          data: { products: [], message: "No hay productos de esta categoría disponibles actualmente", categoryName: catJson.responseBody[0].product_category_name }
        }
      }
    }
    
    return {
      props: {
        success: true,
        data: { products: productsJson.responseBody, categoryName: catJson.responseBody[0].product_category_name }
      }
    }

  } catch (error) {
    return {
      props: {
        error: true,
        data: `${error}`
      }
    }
  }
}