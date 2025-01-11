import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const add = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
}

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
}

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default {add, getAll, remove, update};