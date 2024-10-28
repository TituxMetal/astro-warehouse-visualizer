/// <reference path="../.astro/types.d.ts" />
/// <reference path="./types/lucia.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    session: import('lucia').Session | null
    user: import('lucia').User | null
  }
}
