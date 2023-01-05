import "./comment.scss";
import React, { useState } from "react";
import CommentUser from "./CommentUser/CommentUser";
// import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { selectCurrentUser } from "./../../redux/auth/auth.selectors";
import { db } from "../../firebase/firebaseUtils";
import axios from "axios";
// import axios from "axios";
// import axios from "axios";
export default function Comment({ movieId, commentList, getList }) {
  const alert = useAlert();
  const [content, setContent] = useState("");
  const [contentchild, setContentchild] = useState("");
  const currentUser = useSelector(selectCurrentUser);
  const { displayName, id } = currentUser;

  const run = async () => {
    alert.info("Commenting . . .");
    const formData = new FormData();
    formData.append("text", content);
    let star = 1;

    axios
      .post("http://127.0.0.1:6868/text_classification", formData)
      .then((r) => r.data)
      .then((data) => {
        const result = data?.result[0].toFixed(1);
        if (parseFloat(result) <= -1.5) {
          star = 1;
          // window.alert(1);
        } else if (-1.5 < parseFloat(result) && parseFloat(result) < -0.5) {
          star = 2;
          // window.alert(2);
        } else if (-0.5 <= parseFloat(result) && parseFloat(result) <= 0.5) {
          star = 3;
          // window.alert(3);
        } else if (0.5 < parseFloat(result) && parseFloat(result) <= 2.0) {
          star = 4;
          // window.alert(4);
        } else if (parseFloat(result) > 2.0) {
          star = 5;
          // window.alert(5);
        }
        const obj = {
          userId: currentUser?.id,
          movieId,
          username: displayName,
          content,
          star,
          img: currentUser?.photoURL
            ? currentUser?.photoURL
            : "https://cdn.jsdelivr.net/gh/Th3Wall/assets-cdn/Fakeflix/Fakeflix_profilepic.png",
        };
        db.collection("comment").add(obj);
        setTimeout(() => {
          getList().then(() => {
            alert.success("Commented . . .");
            setContent("");
          });
        }, 500);
      });
  };
  const handleSubmit = async () => {
    try {
      if (!content) {
        alert.error("Please Enter Your Comment !!!");
        return;
      }
      const comments = await db.collection("comment").get();

      if (comments?.docs?.length == 0) {
        run();
      } else {
        const check = comments.docs?.some(
          (comment) =>
            comment.data()?.movieId == movieId &&
            comment.data()?.userId == currentUser?.id
        );
        if (check) {
          alert.info("Please don't comment twice");
        } else {
          run();
        }
        // comments.docs.forEach((comment) => {
        //   console.log("====================================");
        //   console.log(comment.data());
        //   console.log(currentUser?.id);
        //   console.log(movieId);
        //   console.log("====================================");
        //   if (
        //     comment.data()?.movieId == movieId &&
        //   ) {
        //     alert.info("Please don't comment twice");
        //   } else {
        //     run();
        //   }
        // });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitComment = (idP, e) => {
    e.preventDefault();
    alert.info("Commenting . . .");
    const obj = {
      content: contentchild,
      parent_id: idP?.idComment,
      username: displayName,
      img: currentUser?.photoURL
        ? currentUser?.photoURL
        : "https://cdn.jsdelivr.net/gh/Th3Wall/assets-cdn/Fakeflix/Fakeflix_profilepic.png",
    };
    db.collection("comment_child").add(obj);
    setTimeout(() => {
      getList().then(() => {
        alert.success("Commented . . .");
        setContentchild("");
        document.getElementById("comc").value = "";
      });
    }, 500);
  };
  return (
    <div>
      <div className="Comment__container">
        <div className="Comment__header">
          <h3>TOP Comment</h3>
        </div>
        <div className="Comment__content">
          <div className="Comment__list">
            {commentList?.length > 0 &&
              [...commentList].map((item, index) => {
                return (
                  <div key={index} className="Comment__item">
                    <CommentUser
                      username={item?.username}
                      image={item?.img}
                      starts={parseInt(item?.star)}
                      content={item?.content}
                      isReply={false}
                      id={item?.idComment}
                      user_id={id}
                      like={item?.like}
                      disLike={item?.disLike}
                      isLike={item?.isLike}
                      isDisLike={item?.isDisLike}
                      getList={getList}
                    />
                    {item?.commentChildList?.length > 0 &&
                      item?.commentChildList.map((c, index) => {
                        if (c) {
                          return (
                            <div key={index} className="Comment__item--reply">
                              <CommentUser
                                username={c?.username}
                                image={c?.img}
                                content={c?.content}
                                isReply={true}
                              />
                            </div>
                          );
                        }
                      })}
                    <form
                      className="my-5 Comment__item--reply"
                      onSubmit={handleSubmitComment.bind(this, item)}
                    >
                      <p>Enter reply comment</p>
                      <div className="form-group">
                        <input
                          onChange={(e) => setContentchild(e.target.value)}
                          type="text"
                          className="form-control"
                          id="comc"
                          placeholder="Enter Comment"
                        />
                      </div>
                    </form>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="Comment--form">
          <div className="Comment__user">
            <div className="Comment__header--bottom">
              <div className="Comment__avatar--bottom">
                <img
                  src={
                    currentUser?.photoURL
                      ? currentUser?.photoURL
                      : "https://cdn.jsdelivr.net/gh/Th3Wall/assets-cdn/Fakeflix/Fakeflix_profilepic.png"
                  }
                />
              </div>
              <div className="Comment__username--bottom">
                <h4>{currentUser?.displayName}</h4>
              </div>
            </div>
          </div>
          <div className="Comment__form--bottom">
            <div className="Comment__reply--input">
              <input
                type="text"
                placeholder="Enter Your Comment"
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
            </div>
            <div className="Comment__reply--submit">
              <button onClick={handleSubmit}>Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
