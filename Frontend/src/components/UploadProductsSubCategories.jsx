import React, { memo, useEffect } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { RxCross1 } from "react-icons/rx";
import './css/AddSubCategories.css'

const UploadProductsSubCategories = ({
    allSubCategoriesSortedState,
    selectedSubCategoriesState,
}) => {
    const [allSubCategoriesSorted, setAllSubCategoriesSorted] = allSubCategoriesSortedState;
    const [selectedSubCategories, setSelectedSubCategories] = selectedSubCategoriesState;
    // const [form, setForm] = formState;

    // console.log("selectedCategories:", selectedCategories);
    // console.log("allCategoriesSorted:", allCategoriesSorted);
    // console.log('form:', form)
    const handleSelectSubCategory = (e) => {
        e.preventDefault();
        const { selectedIndex } = e.target.options;
        const selectedElement = e.target.options[selectedIndex];
        const { subcatId } = selectedElement.dataset;
        const selectedSubCateg = allSubCategoriesSorted.filter(
            (c) => c._id.toString() === subcatId
        );
        const indexToDelete = allSubCategoriesSorted.findIndex(
            (c) => c._id.toString() === subcatId
        );
        setSelectedSubCategories((prev) => {
            return [...prev, ...selectedSubCateg];
        });
        setAllSubCategoriesSorted((prev) => {
            let newSubCats = [...prev];
            newSubCats.splice(indexToDelete, 1);
            return newSubCats;
        });
    };
    const handleDeleteSelectedSubCategory = (e, id, c, i) => {
        setSelectedSubCategories((prev) => {
            const s = [...prev];
            s.splice(i, 1);
            return s;
        });
        setAllSubCategoriesSorted((prev) => {
            const cs = [...prev, c];
            cs.sort((a, b) => {
                a = a?.name;
                b = b?.name;
                return b > a ? -1 : 1;
            });
            return cs;
        });
    };
    const handleClearAllSelected = (e) => {
      const copy = [...selectedSubCategories];
      setSelectedSubCategories([])
      setAllSubCategoriesSorted((prev)=> {
        return [...prev, ...copy]
      })
    }
    
    return (
        <>
            <div className="_categories font-semibold space-y-1.5 grid relative">
                <label htmlFor="sub-categories" className="capitalize pl-1 w-fit">
                    Sub Categories:
                </label>
                {selectedSubCategories[0] && (
                    <>
                        <div className="_selectedCategories border border-primary-200 bg-gray-50 max-h-30 px-2 pt-3 pb-2 flex flex-wrap gap-3 overflow-y-scroll select-none rounded-lg mb-2 relative">
                            {selectedSubCategories.map((c, i) => {
                                return (
                                    <div
                                        key={`${c.name}_${c._id.toString()}`}
                                        className="group font-light text-neutral-500 bg-fuchsia-100 w-fit pl-2 rounded-md shadow-sm hover:shadow-md  cursor-pointer hover:text-neutral-600 hover:bg-fuchsia-200 relative flex justify-between items-center gap-3"
                                    >
                                        <p className="sm:text-base text-sm font-kanit capitalize">{c.name}</p>
                                        <div
                                            className="relative bottom-0.5 cursor-pointer text-gray-400 group-hover:text-gray-700 hover:bg-red-400 hover:text-white h-fit p-1"
                                            onClick={(e) =>
                                                handleDeleteSelectedSubCategory(e, c._id.toString(), c, i)
                                            }
                                        >
                                            <RxCross1 className="stroke-1" size={11} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div 
                        className="_clearAllButton absolute right-5 top-7 z-10"
                        onClick={(e)=> handleClearAllSelected(e)}
                        >
                            <RxCrossCircled className="rounded-full bg-pink-400 hover:bg-pink-600 text-pink-100 hover:text-pink-50 cursor-pointer" size={20} />
                        </div>
                    </>
                )}
                <select
                    id="sub-categories"
                    name="sub-categories"
                    className="border border-neutral-200 bg-blue-50 p-1.5 px-2.5 outline-none focus:border-primary-100 focus:bg-fuchsia-50 hover:border-primary-100 rounded-lg capitalize font-normal focus:placeholder:opacity-0 placeholder:normal-case"
                    onChange={(e) => handleSelectSubCategory(e)}
                    title="Select from the dropdown"
                >
                    <option hidden value="Select Categories">
                        Select Sub Categories {allSubCategoriesSorted[0] && `(${allSubCategoriesSorted.length})`}
                    </option>
                    {allSubCategoriesSorted[0] &&
                        allSubCategoriesSorted.map((cat, i) => {
                            return (
                                <option
                                    key={cat?.name + "_" + cat?._id.toString()}
                                    value={cat?.name}
                                    data-subcat-id={cat?._id.toString()}
                                >
                                    {cat?.name}
                                </option>
                            );
                        })}
                </select>
            </div>
        </>
    );
};

export default memo(UploadProductsSubCategories);
