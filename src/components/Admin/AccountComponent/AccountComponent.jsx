import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";
import { db, deleteUser } from "../../../firebase/firebaseUtils";
import { signUpStart } from "../../../redux/auth/auth.actions";
export default function AccountComponent() {
  const alert = useAlert();
  const [users, set_users] = useState([]);
  const [isUpdate, set_isUpdate] = useState(false);
  const [id, set_id] = useState(null);
  const dispatch = useDispatch();
  const [obj, set_obj] = useState({
    role: "CUSTOMER",
    displayName: "",
    password: "",
    email: "",
  });

  const getUser = async () => {
    const users = await db.collection("users").get();
    const userList = users.docs.map((user) => {
      return { id: user.id, ...user.data() };
    });
    set_users([...userList]);
  };
  useEffect(() => {
    getUser();
  }, []);
  const handleDelete = async (id) => {
    if (window.confirm("Do you sure want to delete user ?")) {
      const users = deleteUser(id);
      users
        .get()
        .then(async (doc) => {
          if (!doc.exists) {
            alert.error("Delete User Fail");
          }
          return await users.delete();
        })
        .then(() => {
          alert.success("Delete User Success");
          getUser();
        })
        .catch((ee) => {
          console.log(ee);
          alert.error("Delete User Fail");
        });
    }
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    set_obj((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const handleUpdate = (user) => {
    set_id(user?.id);
    set_isUpdate(true);
    console.log("====================================");
    console.log(user);
    console.log("====================================");
    const { role, displayName, password, email } = user;
    set_obj(() => {
      return {
        role,
        displayName: !displayName ? "" : displayName,
        password,
        email,
      };
    });
  };
  const handleCreate = async () => {
    if (!isUpdate) {
      try {
        dispatch(
          signUpStart({
            displayName: obj.displayName,
            email: obj.email,
            password: obj.password,
            role: obj.role,
          })
        );
        setTimeout(() => {
          set_obj({
            role: "CUSTOMER",
            displayName: "",
            password: "",
            email: "",
          });
          getUser();
        }, 2000);
      } catch (error) {
        alert(123);
        alert.error(error?.message);
      }
    } else {
      let document = db.collection("users").doc(`${id}`);
      document
        .update(obj)
        .then(() => {
          alert.success("Update User Success");
          set_obj({
            role: "CUSTOMER",
            displayName: "",
            password: "",
            email: "",
          });
          getUser();
        })
        .catch((err) => {
          console.log("====================================");
          console.log(err);
          console.log("====================================");
          alert.error("Update User Fail");
        });
    }
  };
  return (
    <div>
      <div className="row">
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
          <legend>{isUpdate ? "Update Account" : "Create Account"}</legend>
          <div className="form-group my-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              name="displayName"
              onChange={handleChange}
              value={obj.displayName}
            />
          </div>
          <div className="form-group my-3">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Email"
              name="email"
              onChange={handleChange}
              value={obj.email}
            />
          </div>
          <div className="form-group my-3">
            <label>Password</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Password"
              name="password"
              onChange={handleChange}
              value={obj.password}
            />
          </div>
          <div className="form-group my-3">
            <label>Roles</label>

            <select
              name="role"
              id="input"
              className="form-control"
              required="required"
              onChange={handleChange}
            >
              <option
                defaultValue={"ADMIN"}
                selected={obj.role === "ADMIN"}
                value="ADMIN"
              >
                ADMIN
              </option>
              <option
                defaultValue={"CUSTOMER"}
                selected={obj.role === "CUSTOMER"}
                value="CUSTOMER"
              >
                CUSTOMER
              </option>
            </select>
          </div>
          <button
            onClick={handleCreate}
            type="submit"
            className={isUpdate ? "btn btn-primary" : "btn btn-success"}
          >
            {isUpdate ? "Update Account" : "Create Account"}
          </button>
        </div>

        <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                return (
                  <tr key={user?.id}>
                    <td>{user?.id}</td>
                    <td>{user?.displayName}</td>
                    <td>{user?.role}</td>
                    <td>{user?.email}</td>
                    <td>Hidden</td>
                    <td>
                      <button
                        onClick={() => handleUpdate(user)}
                        type="button"
                        className="btn btn-primary mx-2"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(user?.id)}
                        type="button"
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
