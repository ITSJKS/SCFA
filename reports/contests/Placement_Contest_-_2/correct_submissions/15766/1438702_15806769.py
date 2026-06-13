def repairCars(ranks, cars):
    s = 1
    e = min(ranks)*cars*cars
    ans = float('inf')
    def canRepair(mid,ranks,cars):
        total=0
        for rank in ranks:
            total += math.floor((mid//rank)**(0.5))
            if total >= cars:
                return True
        return False


    while (s<=e):
        mid = (s+e)//2
        if (canRepair(mid,ranks,cars)):
            ans = mid
            e = mid - 1
        else:
            s = mid + 1
    return ans