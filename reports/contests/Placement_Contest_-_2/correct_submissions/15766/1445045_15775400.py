def repairCars(ranks, cars):

    def can(mid):

        totalcars = 0 

        for r in ranks:
            totalcars += int(math.sqrt(mid//r)) 

        return totalcars >= cars

    s = 0 
    e = max(ranks) * cars * cars
    ans = -1


    while s <= e:
        mid = (s + e ) // 2 

        if can(mid):
            ans = mid 
            e = mid - 1

        else:
            s = mid + 1 

    return ans