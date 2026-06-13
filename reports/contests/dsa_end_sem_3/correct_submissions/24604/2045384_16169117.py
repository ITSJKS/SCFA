def findDifference(N, nums):
    ev=0
    od=0
    for i in nums:
        if i%2==0:
            ev+=i
        else:
            od+=i
    return ev-od