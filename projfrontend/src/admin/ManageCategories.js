import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import Base from "../core/Base";
import { deleteCategory, getAllCategories } from "./helper/adminapicall";

const ManageCategories = () => {
  const [category, setCategory] = useState([]);

  const { user, token } = isAuthenticated();

  const preload = () => {
    getAllCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setCategory(data);
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);

  const deleteThisCategory = (categoryId) => {
    deleteCategory(categoryId, user._id, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        preload();
      }
    });
  };

  return (
    <Base title="Welcome Admin" description="Manage Categories here">
      <div className="row bg-dark rounded">
        <div className="col-md-8 offset-md-2 mt-2">
          <Link className="btn btn-info mb-4" to={`/admin/dashboard`}>
            <span className="">Admin Home</span>
          </Link>
          <h2 className="mb-4 text-center text-success">All Categories:</h2>
          <div className="row bg-info rounded m-2">
            <div className="col-12">
              <h2 className="text-center text-white my-3">
                Total {category.length} categories
              </h2>

              {category.map((category, index) => {
                return (
                  <div
                    key={index}
                    value={category._id}
                    className="row text-center mb-2 "
                  >
                    <div className="col-4">
                      <h3 className="text-white text-left">{category.name}</h3>
                    </div>
                    <div className="col-4">
                      <Link
                        className="btn btn-warning"
                        to={`/admin/category/update/${category._id}`}
                      >
                        <span className="">Update</span>
                      </Link>
                    </div>
                    <div className="col-4">
                      <button
                        onClick={() => {
                          deleteThisCategory(category._id);
                        }}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default ManageCategories;
