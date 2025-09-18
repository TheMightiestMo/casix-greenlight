<script setup lang="ts">
import Navbar from '@/pages/Navbar.vue'
</script>

<template>
  <Navbar />

  <main>
    <RouterView />
  </main>
</template>
<style scoped lang="scss">

main {

  padding-top: 60px;
}
  :root {
    --primaryColor: hsl(94, 55%, 56%);
    --hoverColor: hsl(93, 75%, 76%);
    --paleGreen: hsl(96, 75%, 89%);
    --whiteColor: hsl(0, 0%, 100%);
    --blackColor: hsl(0, 0%, 18%);
    --grayText: hsl(0, 0%, 75%);
    --bgColor: hsl(113, 11%, 85%);
    --inputColor: hsl(330, 12%, 97%);


    // FONT
    --biggestFontSize: 2.5rem;
    --h1FontrSize: 1.5rem;
    --h2FontrSize: 1.25rem;
    --h3FontrSize: 1rem;
    --normalFontSize: .938rem;
    --smallFontSize: .813rem;
    --smallestFontSize: .75rem;
  }

  .flex {
    display: flex;
    align-items: center;
  }

  .grid {
    display: grid;
    align-items: center;
    gap: 1.5rem;
  }

  html {
    font-size: 90%;
  }

  a {
    text-decoration: none;
  }

  li {
    list-style: none;
  }

  .icon {
    font-size: var(--h2FontrSize);
    cursor: pointer;
  }

  img, video {
    height: auto;
    width: 100%;
  }

  .message {
    display: none;
  }

  .showMessage {
    display: block;
    color: var(--whiteColor);
    background: black;
    padding: 10px;
    text-align: center;
    border-radius: 3px;
  }

  .btn {
    border: none;
    outline: none;
    cursor: pointer;
    border-radius: 8px;
    padding: .8rem 1rem;
    color: white;
    background: black;
  }

  .btn .icon {
    margin-left: .5rem;
  }

  .headerDiv.with-back-button {
    position: relative;
    display: flex !important;
    align-items: center;
    gap: 1rem;
    padding-left: 100px !important;
  }


  .btn.back-button {
    position: absolute;
    left: 20px;
    transform: translateY(-1px);
    padding: 0.5rem 1rem !important;
    white-space: nowrap;
  }

  //Page Styling

  .loginPage, .registrationPage, .createAccountPage {
    height: 100vh;
    width: 100%;
    margin: auto;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 7px 50px rgb(214, 223, 213);

  }

  .container {
    height: 75vh;
    width: 60%;
    margin: auto;
    justify-content: space-between;
    border-radius: 10px;
    background: hsl(0, 0%, 91%);
  }

  .videoDiv {
    position: relative;
    display: flex;
    flex-basis: 50%;
    width: 70%;
    height: 100%;
    padding: 0 1.5rem;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    margin: auto;
    border-radius: 10px;
    overflow: hidden;

    video, .footerDiv {
      position: absolute;
    }

    video {
      height: 100%;
      width: 100%;
      object-fit: cover;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
    }

    .textDiv {
      position: relative;
      padding-bottom: 100%;

      .title {
        color: black;
        font-size: 35px;
        font-weight: 800;

      }

      p {
        color: black;
        padding: 1rem;
        font-weight: 500;
      }
    }

    .footerDiv {
      bottom: 10px;
      padding: 0 1rem;
      height: 60px;
      background: rgba(255, 255, 255, 0.248);
      left: 10px;
      right: 10px;
      justify-content: space-between;
      backdrop-filter: blur(100px);
      border-radius: 10px;


      .text {
        color: black;
      }

      .btn {
        background: black;
        color: white;
        padding: .8rem 1.5rem;
        border-radius: 10px;
        font-weight: 400;
        transition: .3s ease;

        &:hover {
          background: transparent;
          color: black;

        }
      }
    }

  }

  .formDiv {
    flex-basis: 50%;
    margin: auto;
    flex-direction: column;
    gap: 1.5rem;
    transform: translateY(-1rem);

    .headerDiv {
      text-align: center;
      padding: 1.5rem 0;

      img {
        width: 60px;
        padding-bottom: .5rem;
      }

      h3 {
        font-size: 40px;
        color: black;
        font-weight: 800;

      }
    }

    .form {
      gap: 1rem;

      .inputDiv {
        .icon {
          color: var(--greyText);
        }

        input {
          background: none;
          outline: none;
          border: none;
          width: 200px;
        }

        label {
          color: var(--blackColor);
          font-weight: 400;
          font-size: 14px;
          padding: .5rem 0;
          display: block;
        }

        .input {
          gap: .5rem;
          padding: 1rem;
          background: var(--inputColor);
          border-radius: 10px;
        }
      }

      .btn {
        padding: .8rem;
        background: black;
        border-radius: 10px;
        color: var(--whiteColor);
        align-items: center;
        margin: auto;
        justify-content: center;
        font-size: 16px;
        width: 100%;
        gap: .5rem;
        transition: .3s ease;

        .icon {
          font-size: 25px;
          transition: .3s ease;
        }

        &:hover {
          background: white;
          color: black;

          .icon {
            color: var(--blackColor);
            transform: translateX(80px);
            transition: transform 0.5s ease-in-out, opacity 0.2s ease-in-out 0.5s;
            opacity: 0;
          }
        }
      }

      .forgotPassword {
        font-size: 13px;
        color: var(--blackColor);
        opacity: .7;
        text-align: center;

        a {
          cursor: pointer;
        }
      }
    }
  }


</style>
