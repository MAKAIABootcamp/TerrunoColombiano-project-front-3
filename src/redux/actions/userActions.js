import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";

import { auth, dataBase } from "../../firebase/firebaseConfig";
import { getUsers } from "../../services/getUsers";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { userTypes } from "../types/userTypes";
import { filterCollections } from "../../services/filterCollections";

const collectionName = "users";
const usersCollection = collection(dataBase, collectionName);

const placesCollectionName = "places";
const placesCollection = collection(dataBase, placesCollectionName);

export const loginUser = (user, error) => {
  return {
    type: userTypes.LOGIN_USER,
    payload: { user, error },
  };
};

export const verifyCodeAsync = (code) => {
  return (dispatch) => {
    window.confirmationResult
      .confirm(code)
      .then(async (result) => {
        console.log(result);
        const user = result.user.auth.currentUser;
        console.log(user);
        const userCollection = await getUsers(user.uid);
        console.log(userCollection);
        dispatch(
          loginUser({ ...userCollection }, { status: false, message: "" })
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(loginUser({}, { status: true, message: error.message }));
      });
  };
};
const createPost = (data) => {
  return {
    type: userTypes.ADD_POST,
    payload: data,
  };
};
export const createPostAsync = (post) => {
  const newDocRef = doc(placesCollection);
  const newId = newDocRef.id;
  return async (dispatch) => {
    const currentUser = auth.currentUser;
    let id;
    let array = [];

    try {
      const q = query(usersCollection, where("uid", "==", currentUser.uid));
      const userDoc = await getDocs(q);
      userDoc.forEach((user) => {
        id = user.id;
        array = user.data().posts;
      });

      const newPost = { ...post, id: newId };

      let posts = [...array, newPost];
      const userRef = doc(dataBase, collectionName, id);
      await updateDoc(userRef, { posts: posts });
      const placesDoc = await addDoc(placesCollection, newPost);
      dispatch(createPost(posts));
    } catch (error) {
      console.log(error);
      dispatch(createPost(array));
    }
  };
};
const addFavorite = (data) => {
  return {
    type: userTypes.ADD_FAVORITE,
    payload: data,
  };
};
export const addFavoriteAsync = (fav) => {
  return async (dispatch) => {
    const currentUser = auth.currentUser;
    let id;
    let array = [];

    try {
      const q = query(usersCollection, where("uid", "==", currentUser.uid));
      const userDoc = await getDocs(q);
      userDoc.forEach((user) => {
        id = user.id;
        array = user.data().favorites;
      });

      let favorites = [...array, fav];
      const userRef = doc(dataBase, collectionName, id);
      await updateDoc(userRef, { favorites: favorites });
      dispatch(addFavorite(favorites));
    } catch (error) {
      console.log(error);
      dispatch(addFavorite(array));
    }
  };
};
const deleteFavorite = (data) => {
  return {
    type: userTypes.DELETE_FAVORITE,
    payload: data,
  };
};
export const deleteFavoriteAsync = (item) => {
  return async (dispatch) => {
    const currentUser = auth.currentUser;
    let id;
    let array = [];

    try {
      const q = query(usersCollection, where("uid", "==", currentUser.uid));
      const userDoc = await getDocs(q);
      userDoc.forEach((user) => {
        id = user.id;
        array = user.data().favorites;
      });
      console.log(array);

      let favorites = array.filter((element) => element.id !== item.id);
      const userRef = doc(dataBase, collectionName, id);
      await updateDoc(userRef, { favorites: favorites });
      dispatch(deleteFavorite(favorites));
    } catch (error) {
      console.log(error);
      dispatch(deleteFavorite(array));
    }
  };
};

export const updateProfileAsync = (user) => {
  return async (dispatch) => {
    try {
      console.log(user);
      const userAuth = auth.currentUser;
      await updateProfile(userAuth, {
        displayName: user.name,
        photoURL: user.photo,
        phoneNumber: user.phone,
        birthday: user.birthday,
      });
      await updatePassword(userAuth, user.password);
      await updateEmail(userAuth, user.email);

      const newUser = {
        uid: userAuth.uid,
        name: user.name,
        email: user.email,
        photo: user.photo,
        location: user.location,
        birthday: user.birthday,
        description: user.description,
        type: "user",
        posts: [],
        favorites: [],
      };
      console.log(newUser);
      const userDocs = await addDoc(usersCollection, newUser);
      dispatch(
        loginUser(
          { ...newUser, id: userDocs.id },
          {
            status: false,
            message: "",
          }
        )
      );
    } catch (error) {
      console.log(error);
      dispatch(loginUser({}, { status: true, message: error.message }));
    }
  };
};
export const createUserAsync = (data) => {
  return async (dispatch) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(user);

      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: data.photo,
        phoneNumber: data.phone,
      });
      const newUser = {
        uid: user.auth.currentUser.uid,
        name: data.name,
        email: user.auth.currentUser.email,
        photo: data.photo,
        location: data.location,
        birthday: data.birthday,
        description: data.description,
        phone: data.phone,
        type: "user",
        posts: [],
        favorites: [],
      };
      const userDoc = await addDoc(usersCollection, newUser);

      dispatch(loginUser({ ...newUser }, { status: false, message: "" }));
    } catch (error) {
      console.log(error);
      dispatch(loginUser({}, { status: true, message: error.message }));
    }
  };
};
export const createAdmin = (data) => {
  return async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(user);

      const newUser = {
        uid: user.auth.currentUser.uid,
        name: data.name,
        email: data.email,
        photo: data.photo,
        birthday: data.birthday,
        phone: data.phone,
        type: "admin",
        posts: [],
        favorites: [],
      };
      const userDoc = await addDoc(usersCollection, newUser);
    } catch (error) {
      console.log(error);
    }
  };
};
const logOut = () => {
  return {
    type: userTypes.LOGOUT,
  };
};
export const logOutAsync = () => {
  return async (dispatch) => {
    try {
      signOut(auth);
      dispatch(logOut());
    } catch (error) {
      console.log(error);
    }
  };
};
const editUser = (user) => {
  return {
    type: userTypes.EDIT_USER,
    payload: user,
  };
};
export const editUserAsync = (user) => {
  return async (dispatch) => {
    try {
      const userAuth = auth.currentUser;
      let id;

      const q = query(usersCollection, where("uid", "==", userAuth.uid));
      const userDoc = await getDocs(q);
      userDoc.forEach((user) => {
        id = user.id;
      });

      const userRef = doc(dataBase, collectionName, id);

      await updateProfile(userAuth, {
        displayName: user.name,
        photoURL: user.photo,
        phoneNumber: user.phone,
      });
      await updateEmail(userAuth, user.email);

      const userUpdated = {
        uid: userAuth.uid,
        name: user.name,
        email: user.email,
        photo: user.photo,
        birthday: user.birthday,
        phone: user.phone,
        type: "admin",
        posts : user.posts,
        favorites : user.favorites
      };
      console.log(userUpdated);
      await updateDoc(userRef, userUpdated);
      dispatch(editUser(userUpdated));
    } catch (error) {
      console.log(error);
    }
  };
};
export const editUserNormalAsync = (user) => {
  return async (dispatch) => {
    try {
      const userAuth = auth.currentUser;
      let id;

      const q = query(usersCollection, where("uid", "==", userAuth.uid));
      const userDoc = await getDocs(q);
      userDoc.forEach((user) => {
        id = user.id;
      });

      const userRef = doc(dataBase, collectionName, id);

      await updateProfile(userAuth, {
        displayName: user.name,
        photoURL: user.photo,
        phoneNumber: user.phone,
      });
      await updateEmail(userAuth, user.email);

      const userUpdated = {
        uid: userAuth.uid,
        name: user.name,
        email: user.email,
        photo: user.photo,
        birthday: user.birthday,
        phone: user.phone,
        type: "user",
        posts: user.posts,
        favorites: user.favorites,
      };
      console.log(userUpdated);
      await updateDoc(userRef, userUpdated);
      dispatch(editUser(userUpdated));
    } catch (error) {
      console.log(error);
    }
  };
};
// export const loginWithEmail = (user) => {
//   return {
//     type: userTypes.LOGIN_WITH_EMAIL,
//     payload: user,
//   };
// };

// export const loginWithEmailAsync = ({ email, password }) => {
//   return async (dispatch) => {
//     try {
//       const { user } = await signInWithEmailAndPassword(auth, email, password);

//       const userCollection = await filterCollections({
//         key : "uid",
//         value : user.uid,
//         collectionName : "users"
//       })

//       dispatch(loginWithEmail({
//         ...userCollection[0]
//       }))
//     } catch (error) {
//       dispatch(loginWithEmail({
//         name: "",
//         email : "",
//         phone : "",
//         pgoto : "",
//         birthday : "",
//         type : "",
//         description : "",
//         posts : "",
//         favorites : "",
//         uid : "",
//         location : ""

//       }))
//       console.log(error);
//     }
//   };
// };
export const loginWithEmail = (user) => {
  console.log(user);

  return async (dispatch) => {
    try {
      const email = user.email;
      const password = user.password;
      const userAuth = await signInWithEmailAndPassword(auth, email, password);
      console.log(userAuth);
      const userCollection = await getUsers(userAuth.user.uid);
      console.log(userCollection);
      dispatch(
        loginUser(
          {
            ...userCollection,
          },
          { status: false, message: "" }
        )
      );
    } catch (error) {
      console.log(error);
      dispatch(loginUser({}, { status: true, message: error.message }));
    }
  };
};
export const getFavorites = (favorites) => {
  return {
    type: userTypes.GET_FAVORITES,
    payload: favorites,
  };
};
// export const getFavoritesAsync = () => {

//   return async (dispatch) => {
//     dispatch(getFavorites())

//   }
// };

export const userLoginProvider = (provider) => {
  return async (dispatch) => {
    try {
      const { user } = await signInWithPopup(auth, provider);
      console.log(user);
      const userCollection = await filterCollections({
        key: "uid",
        value: user.uid,
        collectionName: "users",
      });
      const currentUser = auth.currentUser;

      let array = [];
      const q = query(usersCollection, where("uid", "==", currentUser.uid));
      const userDoc = await getDocs(q);
      userDoc.forEach((user) => {
        array = user.data().favorites;
      });
      console.log(array);
      if (userCollection.length === 0) {
        const newUser = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          posts: [],
          favorites: [],
          phone: "",
          location: "",
          description: "",
          birthday: "",
          type: "user",
        };
        const userDoc = await addDoc(usersCollection, newUser);

        dispatch(loginUser({ ...newUser }, { error: false }));
      }
    } catch (error) {
      console.log(error);
      dispatch(loginUser({}, { error: error.message }));
    }
  };
};

const deletePost = (item) => {
  return {
    type: userTypes.DELETE_POST,
    payload: item,
  };
};
export const deletePostAsync = (item) => {
  return async (dispatch) => {
    const currentUser = auth.currentUser;
    let id;
    let array = [];
    let postId;
    try {
      const q = query(usersCollection, where("uid", "==", currentUser.uid));
      const userDoc = await getDocs(q);
      userDoc.forEach((user) => {
        id = user.id;
        array = user.data().posts;
      });
      console.log(array);
      console.log(userDoc);
      const consult = query(placesCollection, where("id", "==", item.id));
      const placeDoc = await getDocs(consult);
      placeDoc.forEach((place) => {
        postId = place.id;
      });
      console.log(placeDoc);

      let posts = array.filter((element) => element.id !== item.id);
      const userRef = doc(dataBase, collectionName, id);
      await updateDoc(userRef, { posts: posts });

      const placesRef = doc(dataBase, placesCollectionName, postId);
      await deleteDoc(placesRef);
      dispatch(deletePost(posts));
    } catch (error) {
      console.log(error);
      dispatch(deletePost(array));
    }
  };
};
const editPost = (item) => {
  return {
    type: userTypes.EDIT_POST,
    payload: item,
  };
};
export const editPostAsync = (item) => {
  return async (dispatch) => {
    const currentUser = auth.currentUser;
    let id;
    let array = [];
    let postId;
    try {
      const q = query(usersCollection, where("uid", "==", currentUser.uid));
      const userDoc = await getDocs(q);
      userDoc.forEach((user) => {
        id = user.id;
        array = user.data().posts;
      });
      console.log(array);
      console.log(userDoc);
      const consult = query(placesCollection, where("id", "==", item.id));
      const placeDoc = await getDocs(consult);
      placeDoc.forEach((place) => {
        postId = place.id;
      });
      console.log(placeDoc);

      let posts = array.find((element) => element.id === item.id);
      const userRef = doc(dataBase, collectionName, id);
      await updateDoc(userRef, { posts: posts });

      const placesRef = doc(dataBase, placesCollectionName, postId);
      await deleteDoc(placesRef);
      dispatch(deletePost(posts));
    } catch (error) {
      console.log(error);
      dispatch(deletePost(array));
    }
  };
};
