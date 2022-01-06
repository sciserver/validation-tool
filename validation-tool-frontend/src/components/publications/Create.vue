<template>
  <div>
    <div class="col-md-12 form-wrapper">
      <h2> Create Customer</h2>
      <form id="create-post-form" @submit.prevent="createCustomer">
        <div class="form-group col-md-12">
          <label for="first_name">First Name</label>
          <input type="text" id="first_name" v-model="first_name" name="title" class="form-control" placeholder="Enter firstname">
        </div>
        <div class="form-group col-md-12">
          <label for="last_name">Last Name</label>
          <input type="text" id="last_name" v-model="last_name" name="title" class="form-control" placeholder="Enter Last name">
        </div>
        <div class="form-group col-md-12">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" name="title" class="form-control" placeholder="Enter email">
        </div>
        <div class="form-group col-md-12">
          <label for="phone_number">Phone</label>
          <input type="text" id="phone_number" v-model="phone" name="title" class="form-control" placeholder="Enter Phone number">
        </div>
        <div class="form-group col-md-12">
          <label for="address">Address</label>
          <input type="text" id="address" v-model="address" name="title" class="form-control" placeholder="Enter Address">
        </div>
        <div class="form-group col-md-12">
            <label for="description">Description</label>
            <input type="text" id="description" v-model="description" name="description" class="form-control" placeholder="Enter Description">
        </div>
        <div class="form-group col-md-4 pull-right">
            <button class="btn btn-success" type="submit">Create Customer</button>
        </div>
      </form>
    </div>
  </div>
</template>