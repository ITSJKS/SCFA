import math
def repairCars(ranks, cars):
    left,right = 1, max(ranks) * (cars**2)
    def repair(time):
        total = 0
        for r in ranks:
            total += int(math.sqrt(time//r))
        return total>= cars
    while left<= right:
        mid = (left+right)//2
        if repair(mid):
            ans = mid 
            right = mid -1
        else:
            left = mid +1
    return ans