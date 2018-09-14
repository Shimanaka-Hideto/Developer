<?php
    // ↓ your code enter!! ↓

    // 配列の要素を設定する
    $arr = [8, 33, 14, 82, 47, 65, 10, 77, 29, 58, 6, 24, 61, 95];
    // 配列の要素を表示する
    echo "ソート前の配列の要素" . "<br>";
    result_view($arr);
    echo "<br>";
    // 昇順ソートした配列を表示する
    echo "昇順ソート後の配列の要素" . "<br>";
    result_view(bubbleSort($arr, "asc"));
    echo "<br>";
    // 降順ソートした配列を表示する
    echo "降順ソート後の配列の要素" . "<br>";
    result_view(bubbleSort($arr, "desc"));

    // 表示用の関数
    function result_view($arr){
        for($i = 0; $i < count($arr) - 1; $i++){
            echo $arr[$i] . " ";
        }
        echo $arr[count($arr) - 1];
    }

    // ソートをする
    function bubbleSort($arr, $method){
        for($i = 0; $i < count($arr); $i++){
            for($j = 0; $j < count($arr) - 1 - $i; $j++){
                // 昇順ソート
                if($method == "asc"){
                    if($arr[$j] > $arr[$j + 1]){
                        $temp = $arr[$j];
                        $arr[$j] = $arr[$j + 1];
                        $arr[$j + 1] = $temp;
                    }
                } elseif($method == "desc"){
                    // 降順ソート
                    if($arr[$j] < $arr[$j + 1]){
                        $temp = $arr[$j];
                        $arr[$j] = $arr[$j + 1];
                        $arr[$j + 1] = $temp;
                    }
                } else {
                    break;
                }
            }
        }
        return $arr;
    }   

    // ↑ Input your code to here!! ↑
?>