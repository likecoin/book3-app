<template>
  <PrivyApp
    :app-id="privyAppId"
    @ready-change="$emit('ready-change', $event)"
    @authenticated-change="$emit('authenticated-change', $event)"
    @user-change="$emit('user-change', $event)"
    @login-method-change="$emit('login-method-change', $event)"
    @logout-method-change="$emit('logout-method-change', $event)"
  />
</template>

<script setup>
import { applyPureReactInVue } from "veaury";

import VeauryPrivyApp from "../react_app/PrivyApp.jsx";

const PrivyApp = applyPureReactInVue(VeauryPrivyApp);

const { privyAppId } = useRuntimeConfig().public;

defineEmits([
  "ready-change",
  "authenticated-change",
  "user-change",
  "login-method-change",
  "logout-method-change",
]);
</script>
