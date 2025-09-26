import Categories from "./Categories";
import {fetchCategories} from "@/services/categoryService";

const CategoriesPage = async () => {
    const categories = await fetchCategories()
    return (
        <div>
            <Categories initialData={categories}/>
        </div>
    )
}

export default CategoriesPage
