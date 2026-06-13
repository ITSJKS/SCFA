def repairCars(ranks, cars):

    def check(time):
        totalCar = 0
        for i in ranks:
            totalCar+= math.floor(math.sqrt(time/i))
        if totalCar>=cars:
            return True
        else:
            return False
    
    left = 1
    right = max(ranks)*cars*cars

    while left<=right:
        mid = (left+right)//2
        if check(mid):
            right = mid-1
        else:
            left = mid+1
    
    return right+1







    # ans =[float('inf'),0]
    # ranks = sorted(ranks, reverse=True)
    # def check(num,ans):
    #     curr = float('-inf')

    #     no = cars//num 
    #     if no<len(ranks):
    #         left = cars - no*num
    #         curr = max(ranks[0]*num*num, ranks[no]*left*left)
    #     else:
    #         left = cars - (len(ranks)-1)*num
    #         curr = max(ranks[0]*num*num, ranks[-1]*left*left)

    #     if curr<ans[0]:
    #         ans[0] = min(ans[0],curr)
    #         ans[1] = num
    #         return True
    #     else:
    #         return False
            


    
    # first =1
    # last = cars
    # while first<=last:
    #     mid = (first+last)//2
    #     if check(mid,ans):
    #         last = mid-1
    #     else:
    #         first = mid+1

    # if ans[0]==float('inf'):
    #     return 0
    # return ans[0]
        







    # mx = max(ranks)
    # mn = min(ranks)
    # l = len(ranks)
    # loop = cars//l 
    # ans =float('inf')
    # for i in range(1,loop+1):
    #     last = cars - i*(l-1)
    #     ans = min(ans, max(mn*last*last, mx*i*i))
    # return ans