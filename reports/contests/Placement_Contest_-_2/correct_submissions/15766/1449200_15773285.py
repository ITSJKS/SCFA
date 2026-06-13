def possibleToRepair(time, cars, ranks):
    idx = 0
    while cars > 0 and idx < len(ranks):
        tempCars = 0
        currRank = ranks[idx]
        start, end = 1, cars

        while start <= end:
            mid = start + ((end - start)//2)

            if (currRank * mid * mid <= time):
                tempCars = mid
                start = mid + 1 
            else:
                end = mid - 1
        cars -= tempCars
        idx += 1
        

    return cars <= 0


def repairCars(ranks, cars):
    start, end = 1, max(ranks) * cars * cars
    res = 0
    while start <= end:

        mid = start + ((end - start)//2)
        if possibleToRepair(mid, cars, ranks):
            res = mid 
            end = mid - 1

        else:
            start = mid + 1

    return res