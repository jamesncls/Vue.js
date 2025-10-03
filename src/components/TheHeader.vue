<template>

    <div>

        <h1 :class="{'title': true, 'title-home': isHome}">
            Curso Vue 3
        </h1>

        <p :class="pClass">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum molestiae totam dolorum! Quia, magni harum eaque dolore, unde officiis hic incidunt numquam consequatur laudantium quod similique eligendi libero impedit labore.
        </p>

        <p :style="styleClass">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Velit, nisi iure omnis sint consectetur natus, error enim voluptate dolore temporibus expedita. Rem fuga eaque aliquam obcaecati harum esse omnis culpa!
        </p>

        <div 
            v-for="(obj, index) in todos"    
            :key="obj.id"
            class="todos-item"
        >
            <img 
                v-show="obj.imgSrc"
                :src="obj.imgSrc"
            >
            {{ index }} - {{ obj.title }}
        </div>


    </div>
</template>

<script>
    export default {
        name: 'App',
        data() {
            return {
                isHome: false,
                classVar: 'title',
                pClass:['text', 'text-home'],
                styleClass:{color: 'aqua', backgroundColor: 'black', fontSize: '20px'},
                todos: [
                    {
                        "userId": 1,
                        "id": 1,
                        "title": "delectus aut autem",
                        "completed": false,
                        "imgSrc": 'https://placehold.co/150x150',
                    },
                    {
                        "userId": 1,
                        "id": 2,
                        "title": "quis ut nam facilis et officia qui",
                        "completed": false,
                        "imgSrc": 'https://placehold.co/150x150',
                        
                    },
                    {
                        "userId": 1,
                        "id": 3,
                        "title": "fugiat veniam minus",
                        "completed": false
                    },
                    {
                        "userId": 1,
                        "id": 4,
                        "title": "et porro tempora",
                        "completed": true
                    },
                    {
                        "userId": 1,
                        "id": 5,
                        "title": "laboriosam mollitia et enim quasi adipisci quia provident illum",
                        "completed": false
                    },
                    {
                        "userId": 1,
                        "id": 6,
                        "title": "qui ullam ratione quibusdam voluptatem quia omnis",
                        "completed": false
                    }
                        
                ]
            }
        }
    }


</script>
<style>
    .title {
        font-size: 20px;
        color: blue;
    }
    .title-home {
        font-size: 40px;
        color: green;
    }
    .text {
        color: yellow;
    }
    .text-home{
        color: #42b983; 
    }
    .todos-item {
            background-color: #000;
            color: #fff;
            padding: 10px;
            text-align: left;
            margin: 10px;
    }
</style>