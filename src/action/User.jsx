"use server";

export default async function Register(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  console.log("🚀 ~ Register ~ name:", name, email, password);

}
