<template>
  <div @keyup.enter="handleSubmit('formInline')" class="login_container">
    <div class="login_box">
      <!--头像-->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!--登录-->
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem class="fromItem" prop="user">
          <Input
            type="text"
            v-model="formInline.username"
            placeholder="Username"
          >
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem class="fromItem" prop="password">
          <Input
            type="password"
            v-model="formInline.password"
            placeholder="Password"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary"     @click="handleSubmit('formInline')"
            >Signin</Button
          >
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formInline: {
        username: '',
        password: ''
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: 'Please fill in the user name',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Please fill in the password.',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: 'The password length cannot be less than 6 bits',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    /**
     * @name:
     * @test: test font
     * @msg:
     * @param {*} name
     * @return {*}
     */
    handleSubmit (name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$http.post('login', this.formInline).then(result => {
            if (result.data.meta.status == 200) {
              this.$Message.success(result.data.meta.msg)
              window.sessionStorage.setItem('token', result.data.data.token)
              this.$router.push('/home')
            } else {
              this.$Message.error(result.data.meta.msg)
            }
          })
        } else {
          this.$Message.error('账号密码有误')
        }
      })
    }
  }
}
</script>

<style Lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 120px;
  width: 120px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
form {
  width: 86%;
  position: absolute;
  left: 7%;
  top: 30%;
}
.fromItem {
  margin-bottom: 8%;
}
</style>
