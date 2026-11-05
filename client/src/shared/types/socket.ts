import type { PetClientToServerEvents, PetServerToClientEvents } from "@features/home/socketEvents/pets.events.ts";
import type { MessageClientToServerEvents, MessageServerToClientEvents } from "@features/messaging/socketEvents/messaging.events.ts";

export type ServerToClientEvents = PetServerToClientEvents & MessageServerToClientEvents;

export type ClientToServerEvents = PetClientToServerEvents & MessageClientToServerEvents;