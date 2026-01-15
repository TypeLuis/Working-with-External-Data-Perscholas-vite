import * as Carousel from "./Carousel.js";
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");

async function initialLoad() {
  try {

    const breeds = await getBreeds_AXIOS();

    breedSelect.innerHTML = "";
    for (const b of breeds) {
      if(!b?.id) continue

      breedsById[b.id] = b

      const opt = document.createElement("option");
      opt.value = b.id;
      opt.textContent = b.name;
      breedSelect.appendChild(opt);
    }
    console.log(breedsById)
    // Step 2: create initial carousel at end of initialLoad
    if (breedSelect.value) {
      await handleBreedChange(breedSelect.value);
    }
  } catch (err) {
    console.error("initialLoad error:", err);
    breedSelect.innerHTML = `<option value="">Failed to load breeds</option>`;
    clearInfo();
    infoDump.textContent = `Failed to load breeds. ${err.message}`;
  }
}

async function getBreeds_AXIOS() {
    const res = await axios.get("/breeds")
    return res.data
}
  

async function handleBreedChange(breedId) {
  const images = await getBreedImages_AXIOS(breedId)

  if (!Array.isArray(images) || images.length === 0) {
    Carousel.clear()
  } else {
    resetCarousel(images)
  }
  renderInfo(breedsById[breedId])
}

async function getBreedImages_AXIOS(breedId) {
    const res = await axios.get("/images/search", {
      params: { breed_ids: breedId, limit: 10 }
    })
    return res.data
}

breedSelect.addEventListener("change", async (e) => {
  try {
    await handleBreedChange(e.target.value)
  } catch (err) {
    console.error("breedSelect change error:", err)
  }
})


/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

const API_KEY = import.meta.env.VITE_API_KEY;

const breedsById = {}

function clearInfo() {
  infoDump.innerHTML = ""
}

function renderInfo(breed) {
  clearInfo()

  if (!breed) {
    infoDump.textContent = "No breed info available."
    return
  }

  const title = document.createElement("h2")
  title.textContent = breed.name ?? "Unknown Breed"

  const origin = document.createElement("p")
  origin.innerHTML = `<strong>Origin:</strong> ${breed.origin ?? "N/A"}`

  const temperament = document.createElement("p")
  temperament.innerHTML = `<strong>Temperament:</strong> ${breed.temperament ?? "N/A"}`

  const desc = document.createElement("p")
  desc.textContent = breed.description ?? "No description available."

  infoDump.append(title, origin, temperament, desc)
}

function resetCarousel(images) {
  Carousel.clear()

  for (const img of images) {
    const alt = img?.breeds?.[0]?.name ?? "Cat"
    const item = Carousel.createCarouselItem(img.url, alt, img.id)
    Carousel.appendCarousel(item)
  }

  Carousel.start()
}

// Step 4: Axios defaults
  axios.defaults.baseURL = "https://api.thecatapi.com/v1";
  axios.defaults.headers.common["x-api-key"] = API_KEY;

  // Step 5: Axios interceptors
  axios.interceptors.request.use((config) => {
    config.metadata = { start: performance.now() }
    console.log(`Request started: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  })

  axios.interceptors.response.use(
    (res) => {
      const start = res.config?.metadata?.start ?? performance.now();
      const ms = Math.round(performance.now() - start);
      console.log(`Response received in ${ms}ms`);
      return res;
    },
    (err) => {
      console.error("Request failed:", err);
      return Promise.reject(err);
    }
  )


initialLoad()


