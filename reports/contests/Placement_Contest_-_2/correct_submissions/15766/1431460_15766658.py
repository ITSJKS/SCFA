import math
def repairCars(ranks, cars):
    ans=0
    left, right = 1, max(ranks)*(cars**2)
    def majnu(time):
        total=0
        for j in ranks:
            total+=int(math.sqrt(time//j))
        return total>=cars
    while left <=right:
        mid=(left+right)//2
        if majnu(mid):
            ans=mid
            right=mid-1
        else:
            left=mid+1
    return ans