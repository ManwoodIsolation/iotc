export const imageMap = {
  "Alarm": "Alarm",
  "Siren": "Alarm", // alarm 和 siren 都映射到同一张图片
  "Music": "Music",
  "Chicken,rooster":'Animal',
  "Glass":'Glass',
  "Police car":"Alarm",
  "Cat":'Animal',
  "Turkey":'Animal',
  "Dog":'Animal',
  "Frog":'Animal',
  "Animal":'Animal',
  "Gun":'Gun',
  "Machine gun":'Gun',
  "Cutlery,silverware":'Glass',
  "Baby cry":'Cry',
  "Crying, sobbing":'Cry',
  "Speech":'Speech',
  "Car alarm":'Alarm',
};

export const danger=[
  "Alarm",
  "Siren",
  "Glass",
  "Police car",
  "Machine gun",
  "Cutlery,silverware",
  "Baby cry",
  "Crying, sobbing",
  "Car alarm",
  "Cry",
  "Animal",
  "Gun"
]
export const isDanger=(type:string):boolean=>{
  return danger.includes(type)
}