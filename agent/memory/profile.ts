import { defineMemory } from "eve/memory";
import { fileMemory, inMemory } from "eve/memory/file";
import { byPrincipal } from "eve/memory/scope";

export default defineMemory({
  description: "Remember stable facts and preferences about the caller.",
  provider: fileMemory({ backend: inMemory() }),
  scope(context) {
    return byPrincipal(context);
  },
});
