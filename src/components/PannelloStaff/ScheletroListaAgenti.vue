<template>
  <div class="rounded border p-6">
    <ul class="m-0 p-0 list-none">
      <li class="mb-4">
        <div class="flex">
          <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
          <div class="self-center" style="flex: 1">
            <Skeleton width="100%" class="mb-2"></Skeleton>
            <Skeleton width="75%"></Skeleton>
          </div>
        </div>
      </li>
      <li class="mb-4">
        <div class="flex">
          <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
          <div class="self-center" style="flex: 1">
            <Skeleton width="100%" class="mb-2"></Skeleton>
            <Skeleton width="75%"></Skeleton>
          </div>
        </div>
      </li>
      <li class="mb-4">
        <div class="flex">
          <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
          <div class="self-center" style="flex: 1">
            <Skeleton width="100%" class="mb-2"></Skeleton>
            <Skeleton width="75%"></Skeleton>
          </div>
        </div>
      </li>
      <li>
        <div class="flex">
          <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
          <div class="self-center" style="flex: 1">
            <Skeleton width="100%" class="mb-2"></Skeleton>
            <Skeleton width="75%"></Skeleton>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
</script>
