import math
def repairCars(ranks, cars):

    l, r = 1, max(ranks) * (cars**2)   
    def maj(time):
        total = 0
        for j in ranks:
            total += int(math.sqrt(time//j))
        return total >= cars
    while l <= r:
        mid = (l+r)//2
        if maj(mid):
            ans = mid
            r = mid -1
        else:
            l = mid + 1
    return ans