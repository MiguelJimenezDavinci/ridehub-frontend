import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faUser,
  faPencil,
  faThumbsUp,
  faCommentAlt,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import { getUserById, followUser, unfollowUser } from "../service/user";
import { getPostsByUserId } from "../service/post";
import { getEventsByUserId } from "../service/events";
import { getCommunityByUserId } from "../service/community";
import SecondaryButton from "../components/Button/SecondaryButton";
import PrimaryButton from "../components/Button/PrimaryButton";
import { useAuth } from "../context/AuthContext";

const UserProfile = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [view, setView] = useState("posts");
  const API_URL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const categoryStyles = {
    encuentro: "bg-red-200 text-red-800",
    competencia: "bg-blue-200 text-blue-800",
    rally: "bg-green-200 text-green-800",
    exhibición: "bg-yellow-200 text-yellow-800",
    otros: "bg-gray-200 text-gray-800",

    motos: "bg-red-200 text-red-800",
    accesorios: "bg-blue-200 text-blue-800",
    rutas: "bg-yellow-200 text-yellow-800",
    eventos: "bg-green-200 text-green-800",
    comunidad: "bg-slate-200 text-gray-800",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserById(id);
        const userPosts = await getPostsByUserId(id);
        const userEvents = await getEventsByUserId(id);
        const userCommunities = await getCommunityByUserId(id);

        setProfileData(userProfile.data);
        setPosts(userPosts || []);
        setEvents(userEvents || []);
        setCommunities(userCommunities || []);

        const isUserFollowing = userProfile.data.followers.some(
          (follower) => String(follower._id) === String(user.id)
        );

        console.log("Followers List:", userProfile.data.followers);
        console.log("Authenticated User ID:", user.id);

        console.log("userid autenticado", user.id);
        console.log("isUserFollowing", isUserFollowing);
        setIsFollowing(isUserFollowing);
      } catch (error) {
        console.error("Error al obtener los datos del perfil:", error);
      }
    };

    fetchData();
  }, [id, user.id]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(id);
      } else {
        await followUser(id);
      }

      setProfileData((prevData) => ({
        ...prevData,
        followersCount: isFollowing
          ? prevData.followersCount - 1
          : prevData.followersCount + 1,
        followers: isFollowing
          ? prevData.followers.filter((f) => f._id !== user.id)
          : [...prevData.followers, { _id: user.id }],
      }));
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error al cambiar el estado de seguimiento:", error);
    }
  };

  /*  const updateFollowersCount = (userId, isFollowing) => {
    setFollowersCount((prev) => (isFollowing ? prev + 1 : prev - 1));
  }; */

  const handleViewToggle = (viewType) => setView(viewType);

  const handleShowPost = (postId) => navigate(`/post/${postId}`);
  const handleShowEvent = (eventId) => navigate(`/events/${eventId}`);
  const handleShowCommunity = (communityId) =>
    navigate(`/communities/${communityId}`);

  const handleSendMensage = (userId) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-[url('../rider-1.jpg')] min-h-screen mt-16">
      <div className="flex flex-col md:flex-row max-w-screen-lg w-full bg-white shadow-md rounded-lg p-4">
        {profileData && (
          <div className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <img
                src={
                  profileData.photo
                    ? `${API_URL}/uploads/${profileData.photo}`
                    : "../default-image.jpg"
                }
                alt="Profile"
                className="w-40 h-40 md:w-52 md:h-52 object-cover object-center rounded-full mx-auto md:mx-0"
              />
              <div className="flex flex-col flex-1 items-center md:items-start">
                <div className="flex flex-col sm:flex-row sm:justify-between w-full mb-4">
                  <p className="text-2xl font-bold text-center sm:text-left">
                    {profileData.role === "premium" && (
                      <FontAwesomeIcon
                        icon={faCrown}
                        className="text-yellow-500 mr-2"
                      />
                    )}
                    @{profileData.username}
                  </p>
                  <div className="flex gap-2 justify-center p-3 md:p-0">
                    <SecondaryButton
                      onClick={() => handleFollowToggle(id)}
                      className={`border-2 px-4 py-2 rounded ${
                        isFollowing
                          ? "bg-red-700 text-white border-red-700"
                          : "text-red-700 border-red-700 hover:bg-red-700 hover:text-white"
                      } transition-all duration-300`}
                    >
                      {isFollowing ? "Siguiendo" : "Seguir"}
                    </SecondaryButton>
                    <PrimaryButton onClick={() => handleSendMensage(id)}>
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Mensaje
                    </PrimaryButton>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-6 sm:p-4 justify-center md:justify-start text-gray-600">
                  <button
                    className="hover:text-red-700"
                    onClick={() => handleViewToggle("events")}
                  >
                    {events.length} Eventos
                  </button>
                  <button
                    className="hover:text-red-700"
                    onClick={() => handleViewToggle("posts")}
                  >
                    {posts.length} Publicaciones
                  </button>
                  <button className="hover:text-red-700">
                    {profileData.followersCount || 0} Seguidores
                  </button>
                  <button className="hover:text-red-700">
                    {profileData.followingCount || 0} Siguiendo
                  </button>
                </div>
                <div className="mt-4 text-center md:text-left">
                  <p className="font-semibold">{profileData.fullName}</p>
                  <p className="text-gray-600">
                    {<FontAwesomeIcon icon={faPencil} />} {profileData.bio}
                  </p>
                  <p className="text-gray-600">
                    {<FontAwesomeIcon icon={faLocationDot} />}{" "}
                    {profileData.location}
                  </p>
                </div>
                {profileData.bikeDetails ? (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">
                      Detalles de la Moto
                    </h2>
                    <div className="flex gap-2 flex-col sm:flex-row sm:gap-4 mt-2">
                      <p>
                        Marca:{" "}
                        {profileData.bikeDetails.brand || "No especificado"}
                      </p>
                      <p>
                        Modelo:{" "}
                        {profileData.bikeDetails.model || "No especificado"}
                      </p>
                      <p>
                        Año: {profileData.bikeDetails.year || "No especificado"}
                      </p>
                      <p>
                        Matrícula:{" "}
                        {profileData.bikeDetails.licensePlate?.toUpperCase() ||
                          "No especificado"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">
                    No hay detalles de la motocicleta disponibles.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <div className="mt-6 w-full h-auto bg-white p-4 rounded-lg shadow-md">
                <div className="flex gap-2 flex-col md:flex-row justify-center items-center">
                  <button
                    onClick={() => handleViewToggle("posts")}
                    className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded${
                      view === "posts"
                        ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                        : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                    }`}
                  >
                    Publicaciones
                  </button>
                  <button
                    onClick={() => handleViewToggle("events")}
                    className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded ${
                      view === "events"
                        ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                        : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                    }`}
                  >
                    Eventos
                  </button>

                  <button
                    onClick={() => handleViewToggle("community")}
                    className={`border-2 border-red-700 font-medium px-4 py-2 w-full text-center rounded ${
                      view === "communities"
                        ? "  bg-red-700 text-white transition-all duration-300 shadow-lg rounded-2xl hover:bg-red-800 hover:border-red-800  hover:rounded-2xl hover:text-white"
                        : "  text-red-700 transition-all duration-300 rounded-xl hover:bg-red-700 hover:text-white hover:rounded-2xl"
                    }`}
                  >
                    Comunidades
                  </button>
                </div>
              </div>
              <div className="mt-6">
                {view === "posts" ? (
                  posts.length === 0 ? (
                    <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                      <p className="text-gray-600">
                        El usuario aún no tiene publicaciones.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {posts.map((post) => (
                        <div
                          key={post._id}
                          onClick={() => handleShowPost(post._id)}
                          className="cursor-pointer border rounded shadow-md"
                        >
                          <img
                            src={`${API_URL}/${post.media}`}
                            alt="Post"
                            className="w-full h-48 object-cover rounded-t"
                          />
                          <div className="w-full px-4">
                            <p className="text-gray-500 text-sm mt-2">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                            <p className="font-semibold mt-2">
                              {post.description.length > 80
                                ? `${post.description.substring(0, 80)}...`
                                : post.description}
                            </p>
                            <p className="flex items-center text-gray-500 mt-1">
                              <FontAwesomeIcon
                                icon={faLocationDot}
                                className="mr-1"
                              />
                              {post.location}
                            </p>
                            {post.category && (
                              <span
                                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                  categoryStyles[post.category.toLowerCase()] ||
                                  categoryStyles.otros
                                }`}
                              >
                                {post.category}
                              </span>
                            )}
                            <div className="flex justify-between items-center my-2 text-gray-500">
                              <div className="flex items-center">
                                <FontAwesomeIcon
                                  icon={faThumbsUp}
                                  className="mr-1"
                                />
                                {post.likes.length}
                              </div>
                              <div className="flex items-center">
                                <FontAwesomeIcon
                                  icon={faCommentAlt}
                                  className="mr-1"
                                />
                                {post.comments.length}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : view === "events" ? (
                  events.length === 0 ? (
                    <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                      <p className="text-gray-600">
                        El usuario aún no tiene eventos.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {events.map((event) => (
                        <div
                          key={event._id}
                          className="cursor-pointer border rounded shadow-md"
                          onClick={() => handleShowEvent(event._id)}
                        >
                          <img
                            src={`${API_URL}/${event.image}`}
                            alt="Event"
                            className="w-full h-48 object-cover rounded-t"
                          />
                          <div className="w-full px-4">
                            <p className="text-gray-500 text-sm mt-2">
                              {new Date(event.createdAt).toLocaleDateString()}
                            </p>
                            <p className="font-bold text-2xl">{event.title}</p>
                            <p className="font-medium text-gray-600 mb-2">
                              {event.description.length > 80
                                ? `${event.description.substring(0, 80)}...`
                                : event.description}
                            </p>
                            <p className="flex items-center text-gray-500 mb-2">
                              <FontAwesomeIcon
                                icon={faLocationDot}
                                className="mr-1"
                              />
                              {event.location}
                            </p>
                            <p className="text-gray-500 mb-2">
                              <FontAwesomeIcon icon={faUser} className="mr-1" />
                              {event.participants.length}
                            </p>
                            {event.category && (
                              <span
                                className={`inline-block px-3 py-1 text-xs mb-2 font-semibold rounded-full ${
                                  categoryStyles[
                                    event.category.toLowerCase()
                                  ] || categoryStyles.otros
                                }`}
                              >
                                {event.category}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : view === "community" ? (
                  communities.length === 0 ? (
                    <div className="mt-4 text-center p-4 flex justify-center items-center flex-col gap-3">
                      <p className="text-gray-600">
                        El usuario aún no tiene comunidades.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {communities.map((comm) => (
                        <div
                          key={comm._id}
                          className="cursor-pointer border rounded shadow-md"
                          onClick={() => handleShowCommunity(comm._id)}
                        >
                          <img
                            src={
                              comm.media
                                ? `${API_URL}/${comm.media}`
                                : "../default-image.jpg"
                            }
                            alt="Community"
                            className="w-full h-48 object-cover object-center rounded-t"
                          />
                          <div className="w-full px-4">
                            <p className="text-gray-500 text-sm mt-2">
                              {new Date(comm.createdAt).toLocaleDateString()}
                            </p>
                            <p className="font-bold text-2xl">{comm.name}</p>
                            <p className="font-medium text-gray-600 mb-2">
                              {comm.description.length > 80
                                ? `${comm.description.substring(0, 80)}...`
                                : comm.description}
                            </p>

                            <p className="text-gray-500 mb-2">
                              <FontAwesomeIcon icon={faUser} className="mr-1" />
                              {comm.members.length}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
