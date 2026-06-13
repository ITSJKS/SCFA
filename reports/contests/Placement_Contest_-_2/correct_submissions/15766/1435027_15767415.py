def repairCars(ranks, cars):
    def check(arr, cars, value):
        total_cars = 0
        for i in arr:
            total_cars += ((value//i)**0.5)//1
        if total_cars >= cars:
            return total_cars
        else:
            return 0
    # for i in range(1, (min(ranks)*(cars*cars))):
    #     ans = check(ranks, cars, i)
    #     if ans != 0:
    #         return ans
    #     else:
    #         continue
    s = 1
    e = min(ranks)*(cars*cars)
    final_ans = 0
    while s <= e:
        mid= (s+e)//2
        ans = check(ranks, cars, mid)
        if ans != 0:
            final_ans = ans
            e = mid-1
        else:
            s = mid+1
    return s
    
    
    # return int(a//1)