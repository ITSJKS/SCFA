def repairCars(ranks, cars):
    import math
    left,right = 1,max(ranks)*(cars**2)
    ans=right


    def maj(time):
        total =0
        for j in ranks:
            total+=int(math.sqrt(time//j))
        return total>=cars    
    while left<=right:
        mid = (left+right)//2
        if maj(mid):
            ans = mid
            right= mid-1
        else:
            left = mid+1    
    return ans