import TWEEN from '@tweenjs/tween.js';

export function AddTweening( Rook ){
    let rookTweenSouth = new TWEEN.Tween({z:-11})
    .to({z: -1}, 500)
    .easing(TWEEN.Easing.Exponential.InOut)
    .delay(250);

    let rookTweenEast = new TWEEN.Tween({x:-11})
    .to({x: -5}, 500)
    .easing(TWEEN.Easing.Exponential.InOut)
    .delay(250);

    let rookTweenNorth = new TWEEN.Tween({z:-1})
    .to({z: -11}, 500)
    .easing(TWEEN.Easing.Exponential.InOut)
    .delay(250);

    let rookTweenWest = new TWEEN.Tween({x:-5})
    .to({x: -11}, 500)
    .easing(TWEEN.Easing.Exponential.InOut)
    .delay(250);

    rookTweenSouth.chain(rookTweenEast);
    rookTweenEast.chain(rookTweenNorth);
    rookTweenNorth.chain(rookTweenWest);
    rookTweenWest.chain(rookTweenSouth);

    rookTweenSouth.onUpdate((coords) =>{
        Rook.position.setZ(coords.z)
    });
    rookTweenNorth.onUpdate((coords) =>{
        Rook.position.setZ(coords.z)
    });
    rookTweenWest.onUpdate((coords) =>{
        Rook.position.setX(coords.x)
    });
    rookTweenEast.onUpdate((coords) =>{
        Rook.position.setX(coords.x)
    });

    return {
        rookTweenNorth,
        rookTweenSouth,
        rookTweenEast,
        rookTweenWest
    }
}